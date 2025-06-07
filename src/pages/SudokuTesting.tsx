
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { SudokuTestingDashboard } from '@/components/admin/testing/SudokuTestingDashboard';

export default function SudokuTesting() {
  return (
    <PageLayout title="Sudoku Testing" subtitle="Comprehensive testing suite for Sudoku game reliability and performance">
      <SudokuTestingDashboard />
    </PageLayout>
  );
}
