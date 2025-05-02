
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from './pages/HomePage';
import Puzzles from './pages/Puzzles';
import PrizesWonPage from './pages/PrizesWonPage';
import SupportPage from './pages/SupportPage';
import HowItWorksPage from './pages/HowItWorksPage';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import ContestRules from './pages/legal/ContestRules';
import CookiePolicy from './pages/legal/CookiePolicy';
import Partnerships from './pages/Partnerships';
import Careers from './pages/Careers';
import Press from './pages/Press';
import PuzzlePage from './pages/PuzzlePage'; // Keep for backward compatibility
import Auth from './pages/Auth'; // Added Auth import

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCFOPage from './pages/AdminCFOPage';
import SupportAdmin from './pages/SupportAdmin';

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
          <Route path="/puzzle" element={<PuzzlePage />} /> {/* Redirects to /puzzles */}
          <Route path="/prizes-won" element={<PrizesWonPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contest-rules" element={<ContestRules />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
        </Route>

        {/* Auth page with no layout */}
        <Route path="/auth" element={<Auth />} />

        {/* Admin Pages using AdminLayout with Outlet */}
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cfo-dashboard" element={<AdminCFOPage />} />
          <Route path="/support-admin" element={<SupportAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
