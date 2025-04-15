
import React from 'react';
import DevelopmentDashboard from '@/components/DevelopmentDashboard';

const DevDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Development Dashboard</h1>
      <DevelopmentDashboard />
    </div>
  );
};

export default DevDashboardPage;
