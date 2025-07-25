class SocketService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map();
  }

  handleConnection(socket) {
    console.log(`User ${socket.userId} connected`);
    
    // Store user connection
    this.connectedUsers.set(socket.userId, {
      socketId: socket.id,
      role: socket.userRole,
      connectedAt: new Date()
    });

    // Join role-based rooms
    socket.join(`role_${socket.userRole}`);
    socket.join(`user_${socket.userId}`);

    // Handle ticket updates
    socket.on('join_ticket', (ticketId) => {
      socket.join(`ticket_${ticketId}`);
    });

    socket.on('leave_ticket', (ticketId) => {
      socket.leave(`ticket_${ticketId}`);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(`ticket_${data.ticketId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
      this.connectedUsers.delete(socket.userId);
    });
  }

  emitTicketUpdate(ticket) {
    this.io.to(`ticket_${ticket._id}`).emit('ticket_updated', ticket);
    
    // Notify assigned user
    if (ticket.assignedTo) {
      this.io.to(`user_${ticket.assignedTo}`).emit('ticket_assigned', ticket);
    }
    
    // Notify admins and agents
    this.io.to('role_admin').emit('ticket_notification', ticket);
    this.io.to('role_agent').emit('ticket_notification', ticket);
  }

  emitDeviceUpdate(deviceId, update) {
    this.io.emit('device_updated', { deviceId, ...update });
  }

  emitSystemAlert(alert) {
    this.io.to('role_admin').emit('system_alert', alert);
    this.io.to('role_agent').emit('system_alert', alert);
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.entries()).map(([userId, data]) => ({
      userId,
      ...data
    }));
  }

  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = SocketService;