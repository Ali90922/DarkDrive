// auth.js
import axios from "axios";

const API_URL = "http://18.220.232.235:8000"; // Adjust this to your backend URL

export const logout = () => {
	localStorage.removeItem("userToken");
};

export const getToken = () => {
	return localStorage.getItem("userToken");
};

export const isAuthenticated = () => {
	return !!localStorage.getItem("userToken");
};

// Add an axios interceptor to include the token in all requests
axios.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const loginUser = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/users/login`, userData);
		// Save token to localStorage if login successful
		if (response.data.token) {
			localStorage.setItem("userToken", response.data.token);
		}
		return response.data;
	} catch (err) {
		throw err.response.data;
	}
};

export const signupUser = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/users/signup`, userData);
		return response.data;
	} catch (err) {
		throw err.response.data;
	}
};
