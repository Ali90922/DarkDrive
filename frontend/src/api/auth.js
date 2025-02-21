// auth.js
import axios from 'axios';

const API_URL = 'http://98.83.145.159:8000'; // Adjust this to your backend URL


export const loginUser = async (userData) => {
  try
  {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    return response.data;
  }
  catch(err)
  {
    throw err.response.data;
  }
}

export const signupUser = async (userData) => {
  try{
    const response = await axios.post(`${API_URL}/users/signup`, userData);
    return response.data;
  }
  catch(err)
  {
    throw err.response.data;
  }
}


