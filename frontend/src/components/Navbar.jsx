import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Sign Up", path: "/" },
		{ name: "Login", path: "/" },
		{ name: "Dashboard", path: "/" },
	];

	return (
		<nav>
			<h1>DarkDrive</h1>
			<ul>
				{navLinks.map((link) => (
					<Link key={link.name} to={link.path}>
						{link.name}
					</Link>
				))}
			</ul>
		</nav>
	);
};

export default Navbar;
