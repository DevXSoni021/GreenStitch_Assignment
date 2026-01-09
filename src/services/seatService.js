import api from './api';

const seatService = {
  getGrid: async () => {
    const response = await api.get('/seats/grid');
    return response.data;
  },

  validateSelection: async (rowIndex, seatIndex, currentSelection) => {
    const response = await api.post('/seats/select', {
      rowIndex,
      seatIndex,
      currentSelection
    });
    return response.data;
  },

  bookSeats: async (seatIds) => {
    const response = await api.post('/seats/book', {
      seatIds
    });
    return response.data;
  },

  clearSelection: async () => {
    const response = await api.post('/seats/clear');
    return response.data;
  },

  resetBookings: async () => {
    const response = await api.post('/seats/reset');
    return response.data;
  }
};

export default seatService;

