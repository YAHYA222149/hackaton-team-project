import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    return Promise.reject(error);
  }
);

// Catalog API
export const catalogAPI = {
  // Get all movies/series
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/catalog', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching catalog:', error);
      throw error;
    }
  },

  // Get featured content
  getFeatured: async () => {
    try {
      const response = await api.get('/catalog/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured content:', error);
      throw error;
    }
  },

  // Get single movie/series
  getById: async (id) => {
    try {
      const response = await api.get(`/catalog/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw error;
    }
  },

  // Add new movie/series (admin only)
  add: async (movieData) => {
    try {
      console.log('Sending movie data to API:', movieData);
      const response = await api.post('/catalog/add', movieData);
      return response.data;
    } catch (error) {
      console.error('Error adding movie:', error);
      if (error.response?.data) {
        console.error('Server response:', error.response.data);
      }
      throw error;
    }
  },

  // Update movie/series (admin only)
  update: async (id, movieData) => {
    try {
      const response = await api.put(`/catalog/${id}`, movieData);
      return response.data;
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  },

  // Delete movie/series (admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/catalog/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  }
};

// Admin API
export const adminAPI = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/admin/verify');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/admin/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;
