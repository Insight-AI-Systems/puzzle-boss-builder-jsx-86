
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { MemoryGameTestDashboard } from '@/components/games/memory/testing/MemoryGameTestDashboard';

export default function MemoryGameTestingPage() {
  return (
    <PageLayout 
      title="Memory Game Testing" 
      subtitle="Comprehensive testing dashboard for memory game mechanics and performance"
    >
      <MemoryGameTestDashboard />
    </PageLayout>
  );
}
