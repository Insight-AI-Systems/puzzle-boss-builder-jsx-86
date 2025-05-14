
import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">PuzzleBoss.com</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Welcome to the Jigsaw Puzzle Engine
      </p>
      <div className="bg-blue-100 p-6 rounded-lg shadow-md max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
        <p className="mb-4">
          The application is being set up. Please navigate to the appropriate sections
          once the routes are fully configured.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
