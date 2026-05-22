import api from './axios';

export const notificationAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  markNotificationRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllNotificationsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};
