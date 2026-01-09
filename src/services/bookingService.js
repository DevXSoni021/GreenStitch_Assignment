import api from './api';

const bookingService = {
  getUserBookings: async (status = null, limit = 50, offset = 0) => {
    const params = { limit, offset };
    if (status) {
      params.status = status;
    }
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  }
};

export default bookingService;

