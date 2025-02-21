import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./pages/FileUpload"; // Adjust path as needed
import Navbar from "./components/Navbar"; // Adjust path as needed
import Dashboard from "./pages/Dashboard";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";

const App = () => {
	return (
		<Router>
			<div className='min-h-screen bg-gray-900'>
				<Navbar />
				<main className='max-w-7xl'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/upload' element={<FileUpload />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/sign-up' element={<SignUpPage />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
};

export default App;
