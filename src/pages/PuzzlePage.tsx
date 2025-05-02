
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component is now deprecated, redirecting to the Puzzles page
const PuzzlePage = () => {
  return <Navigate to="/puzzles" replace />;
};

export default PuzzlePage;
