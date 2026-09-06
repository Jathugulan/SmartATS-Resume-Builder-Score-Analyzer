import axios from 'axios';

// Track active requests to prevent duplicates
const activeRequests = new Map();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ats_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Create a unique key for this request
    const requestKey = `${config.method?.toUpperCase() || 'GET'}_${config.url}`;
    
    // Check if this exact request is already in progress
    if (config.method?.toLowerCase() === 'post' && activeRequests.has(requestKey)) {
      // Cancel the duplicate request
      const controller = activeRequests.get(requestKey);
      controller.abort();
    }
    
    // Store the abort controller for this request
    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;
      activeRequests.set(requestKey, controller);
      
      // Clean up when request completes
      config.signal.addEventListener('abort', () => {
        activeRequests.delete(requestKey);
      }, { once: true });
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // Clean up active request tracking
    const requestKey = `${response.config.method?.toUpperCase() || 'GET'}_${response.config.url}`;
    activeRequests.delete(requestKey);
    return response;
  },
  (error) => {
    // Clean up active request tracking on error
    if (error.config) {
      const requestKey = `${error.config.method?.toUpperCase() || 'GET'}_${error.config.url}`;
      activeRequests.delete(requestKey);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('ats_token');
      localStorage.removeItem('ats_user');
      if (
        window.location.pathname !== '/auth' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/auth?mode=signin&expired=1';
      }
    }
    
    // Keep the server's error code/message when available. 429 can mean either
    // this application's guardrail or an upstream AI provider's quota.
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const code = error.response.data?.code;
      let message = error.response.data?.message || 'Too many requests. Please wait a moment before trying again.';
      if (retryAfter) {
        const seconds = parseInt(retryAfter, 10);
        if (!isNaN(seconds)) {
          message = code === 'AI_RATE_LIMIT'
            ? `The AI provider is busy. Please try again in ${seconds} seconds.`
            : `Rate limit exceeded. Please try again in ${seconds} seconds.`;
        }
      }
      error.response.data = {
        ...error.response.data,
        message,
      };
    }
    
    return Promise.reject(error);
  }
);

export default api;
