import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className='bg-gray-800 p-8'>
			<div className='px-8 flex items-center justify-between'>
				<div className='text-white text-2xl font-bold'>Dark Drive</div>
				<div className='flex space-x-4'>
					<Link
						to='/'
						className='text-gray-300 bg-gray-900 px-6 py-3 text-lg hover:bg-gray-950 transition-colors duration-200 rounded-full'
					>
						Home
					</Link>
					<Link
						to='/sign-up'
						className='text-gray-300 bg-gray-900 px-6 py-3 text-lg hover:bg-gray-950 transition-colors duration-200 rounded-full'
					>
						Signup
					</Link>
					<Link
						to='/login'
						className='text-gray-300 bg-gray-900 px-6 py-3 text-lg hover:bg-gray-950 transition-colors duration-200 rounded-full'
					>
						Login
					</Link>
					<Link
						to='/dashboard'
						className='text-gray-300 bg-gray-900 px-6 py-3 text-lg hover:bg-gray-950 transition-colors duration-200 rounded-full'
					>
						Dashboard
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
