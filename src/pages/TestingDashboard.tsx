
import React from 'react';
import { TestRunner } from '@/testing';

export default function TestingDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Testing Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive testing suite for separated concerns architecture
        </p>
      </div>
      
      <TestRunner />
    </div>
  );
}
