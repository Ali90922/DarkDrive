import React, { useState } from "react";
import { signupUser } from "../api/auth";
import VerificationModal from "./VerificationModal";

const SignUpPage = () => {
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
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

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);
		try {
			const result = await signupUser(formData);
			if (!result.success) {
				setError(result.error);
			}
			setShowModal(true);

			setTimeout(() => {
				setShowModal(false);
			}, 10000);
		} catch (err) {
			setError("An error occurred during signup");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<form
				className={`flex flex-col gap-8 bg-primary/40 backdrop-blur-sm p-8 rounded-xl w-1/4 border-[1px] border-white/40 ${
					showModal && "blur-2xl"
				}`}
				onSubmit={handleSubmit}
			>
				<h2 className='font-bold'>Register</h2>
				<hr />
				<span className='flex flex-col gap-2'>
					<label>Email</label>
					<input
						placeholder='example@email.com'
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</span>
				<span className='flex flex-col gap-2'>
					<label>Password</label>
					<input
						placeholder='••••••••••'
						type='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</span>
				<span className='flex flex-col gap-2'>
					<label>Confirm Password</label>
					<input
						placeholder='••••••••••'
						type='password'
						name='confirmPassword'
						value={formData.confirmPassword}
						onChange={handleChange}
						required
					/>
				</span>
				{error && <p className='text-red-500 text-sm'>{error}</p>}
				<button type='submit' disabled={loading}>
					{loading ? "Signing up..." : "Sign Up"}
				</button>
			</form>
			{showModal && <VerificationModal />}
		</>
	);
};

export default SignUpPage;
