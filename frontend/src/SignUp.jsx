const SignUp = () => {
	return (
		<section>
			<h1>Welcome to DarkDrive</h1>
			<p>Login and upload your files, safe and secure, completely free!</p>
			<hr />
			<span>
				<label>Email</label>
				<input placeholder='example@email.com' type='email' />
			</span>
			<span>
				<label>Password</label>
				<input
					placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
					type='email'
				/>
			</span>
			<span>
				<label>Confirm Password</label>
				<input placeholder='example@email.com' type='email' />
			</span>
		</section>
	);
};

export default SignUp;
