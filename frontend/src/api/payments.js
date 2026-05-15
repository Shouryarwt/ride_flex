import api from './axios';

export const paymentAPI = {
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
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
