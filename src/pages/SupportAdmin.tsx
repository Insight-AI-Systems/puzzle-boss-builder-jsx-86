
import React, { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminTicketDashboard } from '@/components/support/admin/AdminTicketDashboard';
import PageLayout from '@/components/layouts/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/constants/securityConfig';

const SupportAdmin = () => {
  const { user } = useAuth();
  
  // Check for protected admin
  const hasProtectedEmail = isProtectedAdmin(user?.email);
  
  useEffect(() => {
    console.log('Rendering SupportAdmin page', {
      userEmail: user?.email,
      hasProtectedEmail
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
