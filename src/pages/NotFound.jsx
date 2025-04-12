
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-cyan-400">404</h1>
        <p className="text-xl text-gray-300 mb-8">Page not found</p>
        <Link to="/" className="px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-md transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
