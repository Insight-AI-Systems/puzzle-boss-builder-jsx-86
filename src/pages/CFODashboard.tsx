
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

/**
 * Redirects users from the standalone CFO Dashboard to the Finance tab in Admin Dashboard
 */
const CFODashboard: React.FC = () => {
  // Simple redirect without useEffect to prevent unnecessary rendering cycles
  return (
    <ProtectedRoute requiredRoles={['super-admin', 'cfo', 'admin']}>
      <Navigate to="/admin-dashboard?tab=finance" replace />
    </ProtectedRoute>
  );
};

export default CFODashboard;
