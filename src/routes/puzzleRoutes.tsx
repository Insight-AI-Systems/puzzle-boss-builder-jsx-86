
import React from 'react';
import { Route } from 'react-router-dom';
import Puzzles from '@/pages/Puzzles';
import PuzzlePlay from '@/pages/PuzzlePlay';

export const puzzleRoutes = [
  <Route key="puzzles" path="/puzzles" element={<Puzzles />} />,
  <Route key="puzzle-play" path="/puzzle/:puzzleId" element={<PuzzlePlay />} />
];
