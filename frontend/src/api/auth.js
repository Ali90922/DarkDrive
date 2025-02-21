// auth.js
import axios from "axios";

const API_URL = "http://98.83.145.159:8000"; // Adjust this to your backend URL

export const signup = async (email, password) => {
	try {
		const response = await axios.post(`${API_URL}/signup/`, {
			email,
			password,
		});

		if (response.data) {
			// You might want to store the token in localStorage
			localStorage.setItem("userToken", response.data.token);
		}

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		return {
			success: false,
			error: error.response?.data?.message || "An error occurred during signup",
		};
	}
};

export const login = async (email, password) => {
	try {
		const response = await axios.post(`${API_URL}/login/`, {
			email,
			password,
		});

		if (response.data) {
			localStorage.setItem("userToken", response.data.token);
		}

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		return {
			success: false,
			error: error.response?.data?.message || "An error occurred during login",
		};
	}
};

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
