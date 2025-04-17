
import React, { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PuzzleTestRunner } from '@/components/testing/PuzzleTestRunner';
import Breadcrumb from '@/components/common/Breadcrumb';

const PuzzleTests: React.FC = () => {
  const [activeTab, setActiveTab] = useState('unit');
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Dev Dashboard', path: '/dev-dashboard' },
    { label: 'Puzzle Tests', active: true }
  ];
  
  return (
    <PageLayout
      title="Puzzle Test Suite"
      subtitle="Run and monitor puzzle game tests"
    >
      <Breadcrumb items={breadcrumbItems} />
      
      <Tabs defaultValue="unit" className="w-full mt-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="unit">Unit Tests</TabsTrigger>
          <TabsTrigger value="integration">Integration Tests</TabsTrigger>
          <TabsTrigger value="performance">Performance Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unit">
          <Card>
            <CardHeader>
              <CardTitle>Puzzle Unit Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <PuzzleTestRunner testType="unit" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Puzzle Integration Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <PuzzleTestRunner testType="integration" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <PuzzleTestRunner testType="performance" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default PuzzleTests;
