import api from './axios';

export const vehicleAPI = {
  getVehicles: async (params) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  getMyVehicles: async () => {
    const response = await api.get('/vehicles/my-vehicles');
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
};
