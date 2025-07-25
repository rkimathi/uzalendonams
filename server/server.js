/**
 * Server entry point for the Ticket Management System
 */

const { app, server } = require('./app');
const process = require('process');
require('dotenv').config();

// Get port from environment variable or use default
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

// Start the server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received shutdown signal, closing server...');
  
  server.close(() => {
    console.log('Server closed');
    
    // Close database connection
    const mongoose = require('mongoose');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
    
    // If database doesn't close in 5 seconds, force exit
    setTimeout(() => {
      console.error('Could not close MongoDB connection, forcing shutdown');
      process.exit(1);
    }, 5000);
  });
  
  // If server doesn't close in 10 seconds, force exit
  setTimeout(() => {
    console.error('Could not close server in time, forcing shutdown');
    process.exit(1);
  }, 10000);
}