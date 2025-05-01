import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from './pages/HomePage';
import PuzzlePage from './pages/PuzzlePage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCFOPage from './pages/AdminCFOPage';

// Layouts
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Pages → Always use MainLayout for Navbar + Footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/puzzle"
          element={
            <MainLayout>
              <PuzzlePage />
            </MainLayout>
          }
        />

        {/* Admin Pages → Use AdminLayout which includes MainLayout */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          }
        />

        <Route
          path="/cfo-dashboard"
          element={
            <AdminLayout>
              <AdminCFOPage />
            </AdminLayout>
          }
        />

        {/* You can add more routes here */}

      </Routes>
    </Router>
  );
}

export default App;
