
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PuzzleEnginePlayground from '@/components/puzzles/playground/PuzzleEnginePlayground';
import Breadcrumb from '@/components/common/Breadcrumb';

const PuzzleTestPlayground: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Dev Dashboard', path: '/test-dashboard' },
    { label: 'Puzzle Test Playground', active: true }
  ];
  
  return (
    <PageLayout
      title="Puzzle Test Playground"
      subtitle="Compare different puzzle engines in a safe, isolated environment"
    >
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="mb-8">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">Puzzle Engine Comparison</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-muted-foreground">
              This playground allows you to test and compare different puzzle engine implementations 
              without affecting the main application. Select different engines, configure settings, 
              and evaluate which solution works best for our needs.
            </p>
            
            <PuzzleEnginePlayground />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PuzzleTestPlayground;
