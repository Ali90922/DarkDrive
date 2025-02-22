import SignUpPage from "./SignUp";
import Login from "./Login";
import { useState } from "react";

const LoginPage = () => {
	const [signUp, setSignUp] = useState(true);

	const toggleSignUp = () => {
		setSignUp((prev) => !prev);
	};

	return (
		<section className='flex flex-col gap-4 items-center justify-center py-16'>
			{signUp ? (
				<>
					<SignUpPage />
					<span className='flex gap-1'>
						<p>Already Registered?</p>
						<button
							onClick={() => toggleSignUp()}
							className='p-0 bg-transparent text-blue-500 underline'
						>
							Login
						</button>
					</span>
				</>
			) : (
				<>
					<Login />
					<span className='flex gap-1'>
						<p>New User?</p>
						<button
							onClick={() => toggleSignUp()}
							className='p-0 bg-transparent text-blue-500 underline'
						>
							Register Now
						</button>
					</span>
				</>
			)}
		</section>
	);
};

export default LoginPage;
