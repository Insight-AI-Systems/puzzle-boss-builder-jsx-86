
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SudokuTestSuite } from '../../games/sudoku/tests/SudokuTestSuite';
import { PuzzleValidationTest } from '../../games/sudoku/tests/PuzzleValidationTest';
import { PerformanceTest } from '../../games/sudoku/tests/PerformanceTest';
import { TestTube, Zap, CheckCircle, Clock } from 'lucide-react';

export function SudokuTestingDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className="bg-gray-900 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <TestTube className="w-6 h-6 text-puzzle-aqua" />
            Sudoku Game Testing Dashboard
          </CardTitle>
          <p className="text-gray-400">
            Comprehensive testing suite for Sudoku game reliability and performance
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <Zap className="w-8 h-8 text-puzzle-aqua mx-auto mb-2" />
              <div className="text-sm text-puzzle-white font-medium">100 Puzzles</div>
              <div className="text-xs text-gray-400">Per difficulty level</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-puzzle-white font-medium">Algorithm Tests</div>
              <div className="text-xs text-gray-400">Solution validation</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <Clock className="w-8 h-8 text-puzzle-gold mx-auto mb-2" />
              <div className="text-sm text-puzzle-white font-medium">Performance</div>
              <div className="text-xs text-gray-400">Speed optimization</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <TestTube className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-puzzle-white font-medium">Edge Cases</div>
              <div className="text-xs text-gray-400">Reliability testing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="comprehensive" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full bg-gray-800">
          <TabsTrigger value="comprehensive" className="data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
            Comprehensive Suite
          </TabsTrigger>
          <TabsTrigger value="validation" className="data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
            Puzzle Validation
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-puzzle-aqua data-[state=active]:text-puzzle-black">
            Performance Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comprehensive">
          <SudokuTestSuite />
        </TabsContent>

        <TabsContent value="validation">
          <PuzzleValidationTest />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
