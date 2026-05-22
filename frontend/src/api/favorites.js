import api from './axios';

export const favoritesAPI = {
  getMyFavorites: async () => {
    const res = await api.get('/favorites/my');
    return res.data;
  },

  addFavorite: async (vehicleId) => {
    const res = await api.post('/favorites', { vehicleId });
    return res.data;
  },

  removeFavorite: async (vehicleId) => {
    const res = await api.delete(`/favorites/${vehicleId}`);
    return res.data;
  },
};

