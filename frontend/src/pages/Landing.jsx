import { Link } from "react-router-dom";
import SignUpPage from "./SignupPage";
import LandingImage from "/LandingImage.jpg";

const Landing = () => {
	return (
		<section className='grid grid-cols-2'>
			<aside
				style={{ backgroundImage: `url(${LandingImage})` }}
				className='bg-cover bg-center flex flex-col items-center justify-center'
			>
				<div className='flex flex-col gap-8 w-3/4 bg-primary/40 rounded-3xl p-8 py-12 backdrop-blur-sm'>
					<h1>What is DarkDrive?</h1>
					<p className='text-lg'>
						DarkDrive is a decentralized file-sharing system that lets you upload and download files
						securely across a peer-to-peer network. With no central servers, it’s resilient,
						private, and nearly impossible to take down. Share and access files freely—without
						restrictions or censorship. <br />
						<br />
						DarkDrive is built for speed, security, and complete freedom. With end-to-end encryption
						and a distributed network, your files stay safe and accessible anytime. No limits, no
						gatekeepers—just pure, decentralized sharing
					</p>
					<Link to='/about'>
						<button className='w-full h-full'>Learn More</button>
					</Link>
				</div>
			</aside>
			<aside>
				<SignUpPage />
			</aside>
		</section>
	);
};

export default Landing;
