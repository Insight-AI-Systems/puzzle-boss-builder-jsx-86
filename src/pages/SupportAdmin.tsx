
import React, { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminTicketDashboard } from '@/components/support/admin/AdminTicketDashboard';
import PageLayout from '@/components/layouts/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Support Admin Page Component
 * 
 * Dashboard for managing support tickets, accessible only to admins
 * Special handling for protected admin email
 */
const SupportAdmin = () => {
  const { user } = useAuth();
  
  // Check for protected admin
  const hasProtectedEmail = isProtectedAdmin(user?.email);
  
  useEffect(() => {
    debugLog('SupportAdmin', 'Rendering SupportAdmin page', DebugLevel.INFO, {
      userEmail: user?.email,
      hasProtectedEmail,
      userId: user?.id
    });
  }, [user, hasProtectedEmail]);
  
  return (
    <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
      <PageLayout 
        title="Support Admin Dashboard" 
        subtitle="Manage and respond to support tickets"
      >
        <AdminTicketDashboard />
      </PageLayout>
    </ProtectedRoute>
  );
};

export default SupportAdmin;
