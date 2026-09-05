import api from './axios';

// SmartATS Resume CRUD API — /api/resumes
export const smartResumeApi = {
  getAll: () => api.get('/resumes'),
  create: (data) => api.post('/resumes', data),
  getById: (id) => api.get(`/resumes/${id}`),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  remove: (id) => api.delete(`/resumes/${id}`),
  analyze: (id, jobDescription) => api.post(`/resumes/${id}/analyze`, { jobDescription }),
  jobMatch: (id, jobDescription) => api.post(`/resumes/${id}/job-match`, { jobDescription }),
  getLatex: (id, templateId) => api.post(`/resumes/${id}/latex`, { templateId }),
  getPdf: (id, templateId) => api.post(`/resumes/${id}/pdf`, { templateId }, { responseType: 'blob' }),
};

// Legacy resume API (file upload / analysis pipeline)
export const resumeApi = {
  upload: (formData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  analyze: (formData, signal) =>
    api.post('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
      signal,
    }),

  getAnalysis: (id) => api.get(`/resume/${id}`),
  getHistory: () => api.get('/resume/history'),
  updateCandidate: (id, data) => api.patch(`/resume/${id}/candidate`, data),
  deleteAnalysis: (id) => api.delete(`/resume/${id}`),
};
