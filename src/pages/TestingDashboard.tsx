
import React, { useState } from 'react';
import { TestRunner } from '@/testing';
import { ErrorDetectionDashboard } from '@/components/testing/ErrorDetectionDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      
      <Tabs defaultValue="error-detection" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="error-detection">Error Detection</TabsTrigger>
          <TabsTrigger value="test-runner">Test Suite</TabsTrigger>
        </TabsList>
        
        <TabsContent value="error-detection" className="space-y-4">
          <ErrorDetectionDashboard />
        </TabsContent>
        
        <TabsContent value="test-runner" className="space-y-4">
          <TestRunner />
        </TabsContent>
      </Tabs>
    </div>
  );
}
