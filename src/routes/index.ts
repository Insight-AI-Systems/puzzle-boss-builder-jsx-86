
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import { HomePage } from '@/pages';

// Simple AppRoutes component 
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes;
