
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameTestRunner } from './GameTestRunner';
import { LoadTestingDashboard } from './LoadTestingDashboard';
import { PaymentFlowTester } from './PaymentFlowTester';
import { 
  Activity, 
  Users, 
  CreditCard, 
  Trophy, 
  Smartphone, 
  Monitor,
  Timer,
  Gift
} from 'lucide-react';

interface PuzzleTestRunnerProps {
  testType?: 'unit' | 'integration' | 'performance';
}

export default function PuzzleTestRunner({ testType = 'integration' }: PuzzleTestRunnerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-puzzle-black">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-800">
          <TabsTrigger value="overview" className="text-xs lg:text-sm">
            <Activity className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="load-testing" className="text-xs lg:text-sm">
            <Users className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Load Testing</span>
          </TabsTrigger>
          <TabsTrigger value="payment-testing" className="text-xs lg:text-sm">
            <CreditCard className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Payment Testing</span>
          </TabsTrigger>
          <TabsTrigger value="specialized" className="text-xs lg:text-sm">
            <Monitor className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Specialized</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <GameTestRunner />
        </TabsContent>

        <TabsContent value="load-testing" className="mt-6">
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-puzzle-white mb-2">Load Testing Dashboard</h2>
              <p className="text-puzzle-aqua">Test game performance under various load conditions</p>
            </div>
            <LoadTestingDashboard />
          </div>
        </TabsContent>

        <TabsContent value="payment-testing" className="mt-6">
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-puzzle-white mb-2">Payment Flow Testing</h2>
              <p className="text-puzzle-aqua">Comprehensive testing of payment processes across all games</p>
            </div>
            <PaymentFlowTester />
          </div>
        </TabsContent>

        <TabsContent value="specialized" className="mt-6">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-puzzle-white mb-2">Specialized Testing</h2>
              <p className="text-puzzle-aqua">Browser compatibility, mobile performance, and specialized game testing</p>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 cursor-pointer transition-colors">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-puzzle-gold mx-auto mb-2" />
                  <h3 className="font-semibold text-puzzle-white mb-1">Leaderboard Testing</h3>
                  <p className="text-xs text-gray-400">Verify ranking accuracy across all games</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 cursor-pointer transition-colors">
                <CardContent className="p-4 text-center">
                  <Smartphone className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-puzzle-white mb-1">Mobile Performance</h3>
                  <p className="text-xs text-gray-400">Test touch controls and responsiveness</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 cursor-pointer transition-colors">
                <CardContent className="p-4 text-center">
                  <Monitor className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-puzzle-white mb-1">Browser Compatibility</h3>
                  <p className="text-xs text-gray-400">Cross-browser testing suite</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 hover:border-puzzle-aqua/50 cursor-pointer transition-colors">
                <CardContent className="p-4 text-center">
                  <Timer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-puzzle-white mb-1">Timer Synchronization</h3>
                  <p className="text-xs text-gray-400">Verify timer accuracy and sync</p>
                </CardContent>
              </Card>
            </div>

            {/* Test Results Preview */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white">Recent Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-950/30 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Cross-browser compatibility test</span>
                    </div>
                    <span className="text-xs text-green-400">PASSED</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-950/30 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Mobile touch responsiveness</span>
                    </div>
                    <span className="text-xs text-yellow-400">WARNING</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-950/30 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Timer synchronization accuracy</span>
                    </div>
                    <span className="text-xs text-green-400">PASSED</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-950/30 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Prize distribution validation</span>
                    </div>
                    <span className="text-xs text-green-400">PASSED</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
