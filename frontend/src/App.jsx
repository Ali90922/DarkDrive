import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./pages/FileUpload"; // Adjust path as needed
import Dashboard from "./pages/Dashboard";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";

const App = () => {
	return (
		<Router>
			<MainLayout>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/landing' element={<Landing />} />
					<Route path='/upload' element={<FileUpload />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/sign-up' element={<SignUpPage />} />
				</Routes>
			</MainLayout>
		</Router>
	);
};

export default App;
