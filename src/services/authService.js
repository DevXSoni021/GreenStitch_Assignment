import api from './api';

const authService = {
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      name
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { message: 'Logged out successfully' };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService;

