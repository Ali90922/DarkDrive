// auth.js
import axios from 'axios';

const API_URL = 'http://98.83.145.159:8000'; // Adjust this to your backend URL

export const signup = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, {
      email,
      password
    });
    
    if (response.data) {
      // You might want to store the token in localStorage
      localStorage.setItem('userToken', response.data.token);
    }
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred during signup'
    };
  }
};