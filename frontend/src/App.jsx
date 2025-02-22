import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";

const App = () => {
	return (
		<Router>
			<MainLayout>
				<Routes>
					<Route path='/' element={<Landing />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/user' element={<Dashboard />} />
					<Route path='/admin' element={<Admin />} />
				</Routes>
			</MainLayout>
		</Router>
	);
};

export default App;
