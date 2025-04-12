
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        <span className="text-cyan-400">4</span>
        <span className="text-white">0</span>
        <span className="text-yellow-400">4</span>
      </h1>
      <p className="text-xl mb-8 text-center">Oops! We couldn't find the puzzle you're looking for.</p>
      <Link to="/">
        <Button className="bg-cyan-400 text-black hover:bg-cyan-400/90">
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
