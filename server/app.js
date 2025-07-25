const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const deviceRoutes = require('./routes/devices');
const reportRoutes = require('./routes/reports');

// Import services
const SNMPService = require('./services/snmp/snmpService');
const SocketService = require('./services/socket/socketService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize services
const socketService = new SocketService(io);
const snmpService = new SNMPService(socketService);

// Socket middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

// Socket connection handling
io.on('connection', (socket) => {
  socketService.handleConnection(socket);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/reports', reportRoutes);

// Start SNMP monitoring
snmpService.startMonitoring();

module.exports = { app, server };