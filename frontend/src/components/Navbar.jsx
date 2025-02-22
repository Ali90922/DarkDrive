import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Sign Up", path: "/sign-up" },
		{ name: "Login", path: "/login" },
		{ name: "Dashboard", path: "/dashboard" },
	];

	return (
		<nav>
			<h1>DarkDrive</h1>
			<ul>
				{navLinks.map((link) => (
					<Link key={link.name} to={link.path} className='navLink'>
						{link.name}
					</Link>
				))}
			</ul>
		</nav>
	);
};

export default Navbar;
