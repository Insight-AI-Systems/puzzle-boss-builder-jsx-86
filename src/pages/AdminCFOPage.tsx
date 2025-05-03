
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

/**
 * Redirects users from the Admin CFO Page to the Finance tab in Admin Dashboard
 */
const AdminCFOPage: React.FC = () => {
  useEffect(() => {
    console.log('[Admin CFO] Redirecting to consolidated Financial Dashboard');
  }, []);
  
  return (
    <ProtectedRoute requiredRoles={['super_admin', 'cfo', 'admin']}>
      <Navigate to="/admin-dashboard?tab=finance" replace />
    </ProtectedRoute>
  );
};

export default AdminCFOPage;
