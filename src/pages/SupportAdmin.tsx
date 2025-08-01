
import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminTicketDashboard } from '@/components/support/admin/AdminTicketDashboard';
import PageLayout from '@/components/layouts/PageLayout';

const SupportAdmin = () => {
  console.log('Rendering SupportAdmin page');
  return (
    <ProtectedRoute requiredRoles={['admin', 'super-admin']}>
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
