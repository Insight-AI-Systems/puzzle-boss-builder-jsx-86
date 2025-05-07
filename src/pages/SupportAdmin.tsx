
import React, { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminTicketDashboard } from '@/components/support/admin/AdminTicketDashboard';
import PageLayout from '@/components/layouts/PageLayout';
import { useAuth } from '@/contexts/AuthContext';

// Special admin email that should always have access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

const SupportAdmin = () => {
  const { user } = useAuth();
  
  // Check for protected admin
  const isProtectedAdmin = user?.email === PROTECTED_ADMIN_EMAIL;
  
  useEffect(() => {
    console.log('Rendering SupportAdmin page', {
      userEmail: user?.email,
      isProtectedAdmin
    });
  }, [user, isProtectedAdmin]);
  
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
