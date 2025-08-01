
import React from 'react';
import { Route } from 'react-router-dom';
import Puzzles from '@/pages/Puzzles';
// PuzzlePlay removed - using new puzzle system

export const puzzleRoutes = [
  <Route key="puzzles" path="/puzzles" element={<Puzzles />} />,
  // Old puzzle route removed - using new puzzle system
];
