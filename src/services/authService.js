import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  },

  isAdmin: () => {
    // Por ahora, consideraremos admin al usuario con este email
    return localStorage.getItem('userEmail') === 'admin@oscars.com';
  }
}; 