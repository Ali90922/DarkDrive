import React, { useState } from "react";
import { login } from "../api/auth";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		setLoading(true);
		try {
			const result = await login(formData.email, formData.password);
			if (!result.success) {
				setError(result.error);
			}
			// Handle successful login - you might want to redirect or update auth state
		} catch (err) {
			setError("An error occurred during login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-900 flex items-center justify-center p-4'>
			<form
				onSubmit={handleSubmit}
				className='w-full max-w-md bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl space-y-6'
			>
				<div className='text-center space-y-2'>
					<h1 className='text-2xl font-bold text-white'>Welcome Back</h1>
					<p className='text-gray-400'>Login to access your secure files on DarkDrive</p>
				</div>

				<div className='border-t border-gray-700' />

				<div className='space-y-4'>
					<div className='space-y-2'>
						<label className='text-sm font-medium text-gray-300'>Email</label>
						<input
							name='email'
							type='email'
							value={formData.email}
							onChange={handleChange}
							placeholder='example@email.com'
							className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium text-gray-300'>Password</label>
						<input
							name='password'
							type='password'
							value={formData.password}
							onChange={handleChange}
							placeholder='••••••••••'
							className='w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>
				</div>

				{error && <div className='text-red-500 text-sm text-center'>{error}</div>}

				<button
					type='submit'
					disabled={loading}
					className='w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{loading ? "Logging in..." : "Log In"}
				</button>

				<div className='text-center text-sm'>
					<a href='/forgot-password' className='text-blue-400 hover:text-blue-300'>
						Forgot your password?
					</a>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
