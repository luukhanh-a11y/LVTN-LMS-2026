import { api } from '../lib/axios';

export const ticketService = {
  // Admin APIs
  getPendingTickets: async () => {
    const response = await api.get('/admin/tickets');
    return response.data;
  },

  processTicket: async (ticketId: number, status: string, adminNote: string = '') => {
    const response = await api.post(`/admin/tickets/${ticketId}/process`, {
      status,
      adminNote
    });
    return response.data;
  },

  // Teacher APIs
  getMyTickets: async () => {
    const response = await api.get('/teacher/tickets');
    return response.data;
  },

  createTicket: async (studentId: number | null, type: string, description: string) => {
    const response = await api.post('/teacher/tickets', {
      studentId,
      type,
      description
    });
    return response.data;
  }
};
