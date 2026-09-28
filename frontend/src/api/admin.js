import api from './axios';

export const adminAPI = {
  getOverview: async () => (await api.get('/admin/overview')).data,
};
