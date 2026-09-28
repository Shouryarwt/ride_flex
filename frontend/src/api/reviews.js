import api from './axios';

export const reviewAPI = {
  getVehicleReviews: async (vehicleId) => (await api.get(`/reviews/vehicle/${vehicleId}`)).data,
  createReview: async (payload) => (await api.post('/reviews', payload)).data,
};
