import api from './axios';

export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};
