import { Link } from "react-router-dom";

const VerificationModal = () => {
	return (
		<div className='absolute px-32 py-16 bg-primary rounded-3xl text-center flex gap-4 flex-col'>
			<h1>Please Verify Your Email</h1>
			<p>A verification link has been sent to your email.</p>
			<Link
				to='/login'
				className='mt-6 bg-accent hover:bg-highlight transition-colors duration-200 px-4 py-2 rounded-full'
			>
				Go To Login
			</Link>
		</div>
	);
};

export default VerificationModal;
