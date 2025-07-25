import { create } from 'zustand';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export const useSocketStore = create((set, get) => {
  // Get the API URL from environment variables or use default
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  return {
    socket: null,
    connected: false,
    error: null,
    
    // Initialize the socket connection
    initSocket: (token) => {
      if (get().socket) {
        // If a socket already exists, disconnect it first
        get().socket.disconnect();
      }
      
      try {
        // Create a new socket connection with authentication
        const socket = io(API_URL, {
          auth: {
            token
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });
        
        // Set up event handlers
        socket.on('connect', () => {
          set({ connected: true, error: null });
          console.log('Socket connected');
        });
        
        socket.on('disconnect', (reason) => {
          set({ connected: false });
          console.log(`Socket disconnected: ${reason}`);
          
          if (reason === 'io server disconnect') {
            // The server has forcefully disconnected the socket
            toast.error('Disconnected from server. Please refresh the page.');
          }
        });
        
        socket.on('connect_error', (error) => {
          set({ connected: false, error: error.message });
          console.error('Socket connection error:', error);
          toast.error(`Connection error: ${error.message}`);
        });
        
        // Store the socket instance in the state
        set({ socket });
        
        return socket;
      } catch (error) {
        set({ connected: false, error: error.message });
        console.error('Failed to initialize socket:', error);
        toast.error(`Failed to initialize socket: ${error.message}`);
        return null;
      }
    },
    
    // Disconnect the socket
    disconnect: () => {
      const { socket } = get();
      if (socket) {
        socket.disconnect();
        set({ socket: null, connected: false });
      }
    },
    
    // Emit an event to the server
    emit: (event, data, callback) => {
      const { socket, connected } = get();
      if (socket && connected) {
        socket.emit(event, data, callback);
      } else {
        console.warn('Cannot emit event: socket not connected');
        toast.error('Cannot send data: not connected to server');
      }
    },
    
    // Subscribe to an event
    on: (event, handler) => {
      const { socket } = get();
      if (socket) {
        socket.on(event, handler);
      }
    },
    
    // Unsubscribe from an event
    off: (event, handler) => {
      const { socket } = get();
      if (socket) {
        socket.off(event, handler);
      }
    }
  };
});