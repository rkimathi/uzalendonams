# Server.js Implementation Plan

## Overview

The `server.js` file will serve as the entry point for the application, importing the Express app and HTTP server from `app.js` and starting the server with proper error handling and graceful shutdown.

## Implementation Details

### 1. Import Dependencies

```javascript
// Import the app and server from app.js
const { app, server } = require('./app');

// Import required modules
const process = require('process');
require('dotenv').config();
```

### 2. Server Configuration

```javascript
// Get port from environment variable or use default
const PORT = process.env.PORT || 5000;
```

### 3. Server Startup with Error Handling

```javascript
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
```

### 4. Graceful Shutdown Handling

```javascript
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
```

## Complete Implementation

The complete `server.js` file should look like this:

```javascript
/**
 * Server entry point for the Ticket Management System
 */

const { app, server } = require('./app');
const process = require('process');
require('dotenv').config();

// Get port from environment variable or use default
const PORT = process.env.PORT || 5000;

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
```

## Next Steps

1. Switch to Code mode to implement this solution
2. Create the server.js file with the code above
3. Test the server startup functionality
4. Verify error handling and graceful shutdown