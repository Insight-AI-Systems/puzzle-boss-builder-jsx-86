
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from './pages/HomePage';
import PuzzlePage from './pages/PuzzlePage';
import PrizesWonPage from './pages/PrizesWonPage';
import SupportPage from './pages/SupportPage';
import HowItWorksPage from './pages/HowItWorksPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboard';
import AdminCFOPage from './pages/AdminCFOPage';

// Layouts
import { MainLayout } from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages using MainLayout with Outlet */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/puzzle" element={<PuzzlePage />} />
          <Route path="/prizes-won" element={<PrizesWonPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Route>

        {/* Admin Pages using AdminLayout with Outlet */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/cfo-dashboard" element={<AdminCFOPage />} />
        </Route>

        {/* You can add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
