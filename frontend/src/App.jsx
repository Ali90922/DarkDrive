import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./pages/FileUpload"; // Adjust path as needed
import Navbar from "./components/Navbar"; // Adjust path as needed
import Dashboard from "./pages/Dashboard";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import Footer from "./components/Footer";

const App = () => {
	return (
		<Router>
			<div>
				<Navbar />
				<main>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/upload' element={<FileUpload />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/sign-up' element={<SignUpPage />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
