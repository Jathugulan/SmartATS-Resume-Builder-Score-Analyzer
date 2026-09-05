import api from './axios';

export const builderApi = {
  getResumes: async () => {
    const response = await api.get('/builder');
    return response.data?.data?.resumes || [];
  },

  getResumeById: async (id) => {
    const response = await api.get(`/builder/${id}`);
    return response.data?.data?.resume;
  },

  createResume: async (data) => {
    const response = await api.post('/builder', data);
    return response.data?.data?.resume;
  },

  createFromAnalysis: async (analysisId) => {
    const response = await api.post(`/builder/from-analysis/${analysisId}`);
    return response.data?.data?.resume;
  },

  updateResume: async (id, data) => {
    const response = await api.put(`/builder/${id}`, data);
    return response.data?.data?.resume;
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/builder/${id}`);
    return response.data;
  },

  renderLatex: async (id, templateId) => {
    const response = await api.get(`/builder/${id}/latex`, {
      params: templateId ? { templateId } : {},
    });
    return response.data?.data;
  },

  downloadPdf: async (id, templateId, candidateName = 'resume') => {
    const response = await api.get(`/builder/${id}/pdf`, {
      params: templateId ? { templateId } : {},
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  downloadOverleafZip: async (id, templateId, candidateName = 'resume') => {
    const response = await api.get(`/builder/${id}/export/overleaf`, {
      params: templateId ? { templateId } : {},
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Overleaf_${candidateName.replace(/\s+/g, '_')}_Project.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  downloadPackageZip: async (id, coverLetter, templateId, candidateName = 'candidate') => {
    const response = await api.post(
      `/builder/${id}/export/package`,
      { coverLetter },
      {
        params: templateId ? { templateId } : {},
        responseType: 'blob',
      }
    );
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Application_Package_${candidateName.replace(/\s+/g, '_')}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
