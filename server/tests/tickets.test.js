const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

describe('Ticket API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Create test user
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      department: 'IT'
    });
    await user.save();
    userId = user._id;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Ticket.deleteMany({});
  });

  describe('POST /api/tickets', () => {
    it('should create a new ticket', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'This is a test ticket',
        type: 'incident',
        priority: 'medium',
        category: 'Hardware'
      };

      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ticketData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.ticket.title).toBe(ticketData.title);
      expect(response.body.ticket.ticketNumber).toBeDefined();
    });
  });

  describe('GET /api/tickets', () => {
    it('should fetch all tickets', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.tickets)).toBe(true);
    });
  });
});