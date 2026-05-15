import api from './axios';

export const dealerAPI = {
  getDealerProfile: async () => {
    const response = await api.get('/dealers/profile');
    return response.data;
  },

  updateDealerProfile: async (data) => {
    const response = await api.put('/dealers/profile', data);
    return response.data;
  },

  getAllDealers: async (params) => {
    const response = await api.get('/dealers', { params });
    return response.data;
  },

  approveDealerStatus: async (id, status) => {
    const response = await api.put(`/dealers/${id}/approve`, { status });
    return response.data;
  },
};
