const SignUp = () => {
	return (
		<section className='flex flex-col gap-4 w-96 border-2 border-black rounded-3xl items-center justify-center p-8'>
			<h1>Welcome to DarkDrive</h1>
			<p className='text-center'>Login and upload your files, safe and secure, completely free!</p>
			<hr />
			<span className='flex flex-col gap-2 w-full'>
				<label>Email</label>
				<input placeholder='example@email.com' type='email' />
			</span>
			<span className='flex flex-col gap-2 w-full'>
				<label>Password</label>
				<input
					placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
					type='password'
				/>
			</span>
			<span className='flex flex-col gap-2 w-full'>
				<label>Confirm Password</label>
				<input
					placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
					type='password'
				/>
			</span>
		</section>
	);
};

export default SignUp;
