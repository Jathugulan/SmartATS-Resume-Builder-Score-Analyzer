import api from './axios';

export const intelligenceApi = {
  getResumeIntelligence: async (resumeId) => {
    const response = await api.get(`/intelligence/resume/${resumeId}`);
    return response.data?.data?.intelligence;
  },

  analyzeJob: async (data) => {
    const response = await api.post('/intelligence/job/analyze', data);
    return response.data?.data?.jobDescription;
  },

  matchResumeWithJob: async (data) => {
    const response = await api.post('/intelligence/match', data);
    return response.data?.data;
  },

  getCareerPaths: async (resumeId) => {
    const response = await api.get(`/intelligence/career-paths/${resumeId}`);
    return response.data?.data?.careerPaths;
  },

  optimizeResume: async (data) => {
    const response = await api.post('/intelligence/optimize', data);
    return response.data?.data;
  },

  improveBullet: async (data) => {
    const response = await api.post('/intelligence/bullet/improve', data);
    return response.data?.data;
  },

  simulateScore: async (data) => {
    const response = await api.post('/intelligence/simulate-score', data);
    return response.data?.data;
  },

  scanRisks: async (resumeId) => {
    const response = await api.get(`/intelligence/risks/${resumeId}`);
    return response.data?.data?.risks;
  },

  createCoverLetter: async (data) => {
    const response = await api.post('/intelligence/cover-letter', data);
    return response.data?.data;
  },

  getRecruiterSimulation: async (resumeId) => {
    const response = await api.get(`/intelligence/recruiter-simulation/${resumeId}`);
    return response.data?.data;
  },

  getInterviewQuestions: async (resumeId, role) => {
    const response = await api.get(`/intelligence/interview/questions/${resumeId}`, {
      params: role ? { role } : {},
    });
    return response.data?.data;
  },

  evaluateInterviewAnswer: async (data) => {
    const response = await api.post('/intelligence/interview/evaluate', data);
    return response.data?.data?.evaluation;
  },

  chatAssistant: async (data) => {
    const response = await api.post('/intelligence/chat', data);
    return response.data?.data;
  },
};
