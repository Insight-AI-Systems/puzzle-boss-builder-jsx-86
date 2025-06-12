
import React from 'react';
import { Route } from 'react-router-dom';
import UnityJigsawPuzzle from '@/pages/games/UnityJigsawPuzzle';

export const unityGameRoutes = [
  <Route key="unity-jigsaw-puzzle" path="/games/unity-jigsaw-puzzle" element={<UnityJigsawPuzzle />} />
];
