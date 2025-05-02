
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from './pages/HomePage';
import Puzzles from './pages/Puzzles';
import PrizesWonPage from './pages/PrizesWonPage';
import SupportPage from './pages/SupportPage';
import HowItWorksPage from './pages/HowItWorksPage';
import Contact from './pages/Contact';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCFOPage from './pages/AdminCFOPage';

// Layouts
import { MainLayout } from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages using MainLayout with Outlet */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/prizes-won" element={<PrizesWonPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Pages using AdminLayout with Outlet */}
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cfo-dashboard" element={<AdminCFOPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
