import api from './axios';

export const templateApi = {
  getTemplates: async () => {
    const response = await api.get('/templates');
    return response.data?.data?.templates || [];
  },

  getTemplateById: async (id) => {
    const response = await api.get(`/templates/${id}`);
    return response.data?.data?.template;
  },

  uploadTemplate: async (formData) => {
    const response = await api.post('/templates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data;
  },

  duplicateTemplate: async (id) => {
    const response = await api.post(`/templates/${id}/duplicate`);
    return response.data?.data?.template;
  },
};
