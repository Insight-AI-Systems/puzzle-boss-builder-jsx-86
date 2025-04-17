
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <span className="font-game text-2xl">
        <span className="text-puzzle-aqua">The</span>{' '}
        <span className="text-puzzle-white">Puzzle</span>{' '}
        <span className="text-puzzle-gold">Boss</span>
      </span>
    </Link>
  );
};

export default Logo;
