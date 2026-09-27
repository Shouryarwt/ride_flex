import api from './axios';

export const paymentAPI = {
  createOrder: async (bookingId) => {
    const response = await api.post('/payments/order', { bookingId });
    return response.data;
  },

  verifyPayment: async (payload) => {
    const response = await api.post('/payments/verify', payload);
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
  },

  getPaymentByBooking: async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  },
};
