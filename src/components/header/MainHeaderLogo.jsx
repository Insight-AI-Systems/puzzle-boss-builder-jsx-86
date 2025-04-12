
import React from 'react';
import { Link } from 'react-router-dom';

const MainHeaderLogo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center group transition-transform hover:scale-105 duration-300"
    >
      <span className="text-2xl font-bold">
        <span className="text-cyan-400 transition-all duration-300 group-hover:text-cyan-300">The</span>{" "}
        Puzzle{" "}
        <span className="text-yellow-400 transition-all duration-300 group-hover:text-yellow-300">Boss</span>
      </span>
    </Link>
  );
};

export default MainHeaderLogo;
