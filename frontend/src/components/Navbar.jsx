import React, { useState, useEffect, isValidElement } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
	const MOBILE_WIDTH = 768;
	const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < MOBILE_WIDTH;
			setIsMobile(mobile);
			if (!mobile) {
				setMenuOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Login", path: "/login" },
	];

	return (
		<>
			<nav>
				<Link to='/'>
					<h1 className='font-display'>DarkDrive</h1>
				</Link>
				{isMobile ? (
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className='focus:outline-none rounded-none py-8'
					>
						{menuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				) : (
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
				)}
			</nav>

			{isMobile && menuOpen && (
				<ul className='bg-primary'>
					{navLinks.map((link) => (
						<Link
							key={link.name}
							to={link.path}
							className={`p-8 flex flex-col items-center justify-center text-xl ${
								link.name === "Login" && "bg-accent text-primary"
							}`}
						>
							{link.name}
						</Link>
					))}
				</ul>
			)}
		</>
	);
};

export default Navbar;
