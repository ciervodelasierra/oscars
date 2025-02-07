import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories';

export const categoryService = {
  getAllCategories: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  updateWinner: async (categoryId, winner, token) => {
    const response = await axios.put(
      `${API_URL}/winner/${categoryId}`,
      { winner },
      {
        headers: { 'x-auth-token': token }
      }
    );
    return response.data;
  },

  toggleLock: async (categoryId, isLocked, token) => {
    const response = await axios.put(
      `${API_URL}/lock/${categoryId}`,
      { isLocked },
      {
        headers: { 'x-auth-token': token }
      }
    );
    return response.data;
  },

  initializeCategories: async (token) => {
    const response = await axios.post(
      `${API_URL}/initialize`,
      {},
      {
        headers: { 'x-auth-token': token }
      }
    );
    return response.data;
  }
}; 