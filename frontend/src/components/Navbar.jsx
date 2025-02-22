import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Login", path: "/login" },
	];

	return (
		<nav>
			<Link to="/">DarkDrive</Link>
			<ul>
				{navLinks.map((link) => (
					<Link
						key={link.name}
						to={link.path}
						className={`navLink ${
							link.name === "Login" && "h-4 px-4 bg-accent text-primary hover:bg-highlight"
						}`}
					>
						{link.name}
					</Link>
				))}
			</ul>
		</nav>
	);
};

export default Navbar;
