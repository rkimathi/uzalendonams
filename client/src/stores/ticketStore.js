import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,

  fetchTickets: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/tickets');
      set({ tickets: response.data.tickets, loading: false });
    } catch (error) {
      set({ error: error?.message || 'An error occurred', loading: false });
      toast.error('Failed to fetch tickets');
    }
  },

  fetchTicket: async (id) => {
    set({ loading: true });
    try {
      const response = await api.get(`/tickets/${id}`);
      set({ currentTicket: response.data.ticket, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to fetch ticket');
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      set(state => ({
        tickets: [response.data.ticket, ...state.tickets]
      }));
      toast.success('Ticket created successfully');
      return response.data.ticket;
    } catch (error) {
      toast.error('Failed to create ticket');
      throw error;
    }
  },

  updateTicket: async (id, updates) => {
    try {
      const response = await api.patch(`/tickets/${id}`, updates);
      set(state => ({
        tickets: state.tickets.map(t => 
          t._id === id ? response.data.ticket : t
        ),
        currentTicket: state.currentTicket?._id === id 
          ? response.data.ticket 
          : state.currentTicket
      }));
      toast.success('Ticket updated successfully');
      return response.data.ticket;
    } catch (error) {
      toast.error('Failed to update ticket');
      throw error;
    }
  },

  deleteTicket: async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      set(state => ({
        tickets: state.tickets.filter(t => t._id !== id)
      }));
      toast.success('Ticket deleted successfully');
    } catch (error) {
      toast.error('Failed to delete ticket');
      throw error;
    }
  },

  addWorkNote: async (ticketId, note) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/notes`, note);
      set(state => ({
        currentTicket: state.currentTicket?._id === ticketId 
          ? response.data.ticket 
          : state.currentTicket
      }));
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
      throw error;
    }
  }
}));