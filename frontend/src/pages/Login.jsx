import React, { useEffect, useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await loginUser(formData);

			if (result.message == "Login successful") {
				// If we got a token, login was successful
				const email = result.email;
				console.log(result);
				localStorage.setItem("email", email);
				navigate("/");
			} else {
				setError("Login failed - no token received");
			}
		} catch (err) {
			console.error("Error:", err);
			setError(err.message || "An error occurred during login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center pt-8 min-h-screen bg-gray-900 text-white'>
			<h1 className='text-3xl font-bold mb-4'>Welcome to DarkDrive</h1>
			<p className='text-gray-400 mb-6'>
				Login and upload your files, safe and secure, completely free!
			</p>
			<form className='bg-gray-800 p-6 rounded-lg shadow-lg w-80' onSubmit={handleSubmit}>
				<label className='block text-sm font-medium mb-1'>Email</label>
				<input
					className='w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
					type='email'
					name='email'
					value={formData.email}
					onChange={handleChange}
					required
				/>

				<label className='block text-sm font-medium mb-1'>Password</label>
				<input
					className='w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
					type='password'
					name='password'
					value={formData.password}
					onChange={handleChange}
					required
				/>

				{error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

				<button
					className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50'
					type='submit'
					disabled={loading}
				>
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
