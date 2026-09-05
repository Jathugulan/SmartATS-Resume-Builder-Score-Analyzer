import api from './axios';

export const reportApi = {
  generateReport: (id) =>
    api.post(`/resume/${id}/report`, {}, {
      responseType: 'blob',
      timeout: 30000,
    }),
};
