import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./pages/FileUpload"; // Adjust path as needed
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";

const App = () => {
	return (
		<Router>
			<MainLayout>
				<Routes>
					<Route path='/' element={<Landing />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/user' element={<Home />} />
					<Route path='/dashboard' element={<Dashboard />} />
				</Routes>
			</MainLayout>
		</Router>
	);
};

export default App;
