import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './pages/FileUpload';  // Adjust path as needed
import Navbar from './components/Navbar';  // Adjust path as needed
import Dashboard from './pages/Dashboard';
import SignUpPage from './pages/SignupPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={
              <div className="text-white">
                <h1 className="text-3xl font-bold">Welcome to File Upload App</h1>
                <p className="mt-4">Use the navigation to upload files.</p>
              </div>
            } />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;