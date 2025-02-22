import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Login", path: "/login" },
		{ name: "Admin", path: "/admin" },
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
