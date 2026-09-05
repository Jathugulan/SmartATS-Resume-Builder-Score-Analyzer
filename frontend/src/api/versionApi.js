import api from './axios';

export const versionApi = {
  getVersions: async (resumeId) => {
    const response = await api.get(`/versions/resume/${resumeId}`);
    return response.data?.data?.versions || [];
  },

  createVersion: async (resumeId, data) => {
    const response = await api.post(`/versions/resume/${resumeId}`, data);
    return response.data?.data?.version;
  },

  compareVersions: async (versionAId, versionBId) => {
    const response = await api.post('/versions/compare', { versionAId, versionBId });
    return response.data?.data?.diff;
  },
};
