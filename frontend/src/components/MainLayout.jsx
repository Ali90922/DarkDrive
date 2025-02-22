import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
	return (
		<div>
			{/* Header */}
			<Navbar />

			{/* Main Content */}
			<main>{children}</main>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default MainLayout;
