import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-bold">
          Dark Drive
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/" 
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link 
            to="/upload" 
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Upload Files
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;