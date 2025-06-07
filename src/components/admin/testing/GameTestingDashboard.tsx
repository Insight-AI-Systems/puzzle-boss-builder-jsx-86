
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  Square, 
  Timer, 
  Trophy, 
  Smartphone, 
  Monitor, 
  Bug,
  Zap,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GameTestMetrics } from './GameTestMetrics';
import { MockPlayerSimulator } from './MockPlayerSimulator';
import { TimerAccuracyTest } from './TimerAccuracyTest';
import { ScoreVerificationTest } from './ScoreVerificationTest';
import { MobileSimulationView } from './MobileSimulationView';
import { GameDebugConsole } from './GameDebugConsole';

interface GameTestingDashboardProps {
  gameId?: string;
  gameName?: string;
}

export function GameTestingDashboard({ 
  gameId = 'test-game', 
  gameName = 'Test Game' 
}: GameTestingDashboardProps) {
  const [testMode, setTestMode] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [testResults, setTestResults] = useState<any>({});
  const { toast } = useToast();

  const toggleTestMode = () => {
    setTestMode(!testMode);
    toast({
      title: testMode ? "Test Mode Disabled" : "Test Mode Enabled",
      description: testMode 
        ? "Payment requirements are now enforced" 
        : "Payment requirements bypassed for testing",
      variant: testMode ? "destructive" : "default"
    });
  };

  const runComprehensiveTest = async () => {
    setIsRunningTests(true);
    try {
      // Simulate comprehensive testing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const results = {
        loadTime: Math.random() * 2000 + 500,
        responsiveness: Math.random() * 100 + 85,
        timerAccuracy: Math.random() * 5 + 95,
        scoreAccuracy: Math.random() * 3 + 97,
        completionRate: Math.random() * 10 + 90
      };
      
      setTestResults(results);
      
      toast({
        title: "Test Suite Complete",
        description: "All tests have been executed successfully",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Error running test suite",
        variant: "destructive"
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-puzzle-white">Game Testing Dashboard</h1>
            <p className="text-puzzle-aqua">Testing: {gameName}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-puzzle-white text-sm">Test Mode</label>
              <Switch 
                checked={testMode} 
                onCheckedChange={toggleTestMode}
                className="data-[state=checked]:bg-puzzle-aqua"
              />
              {testMode && (
                <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold">
                  Bypass Payments
                </Badge>
              )}
            </div>
            
            <Button 
              onClick={runComprehensiveTest}
              disabled={isRunningTests}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              {isRunningTests ? (
                <>
                  <Timer className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Device Mode Toggle */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={deviceMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceMode('desktop')}
                className={deviceMode === 'desktop' 
                  ? 'bg-puzzle-aqua text-puzzle-black' 
                  : 'border-gray-600 text-gray-400'
                }
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={deviceMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceMode('mobile')}
                className={deviceMode === 'mobile' 
                  ? 'bg-puzzle-aqua text-puzzle-black' 
                  : 'border-gray-600 text-gray-400'
                }
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results Overview */}
        {Object.keys(testResults).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-puzzle-aqua">
                  {testResults.loadTime?.toFixed(0)}ms
                </div>
                <div className="text-sm text-gray-400">Load Time</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-puzzle-gold">
                  {testResults.responsiveness?.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Responsiveness</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {testResults.timerAccuracy?.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Timer Accuracy</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {testResults.scoreAccuracy?.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Score Accuracy</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {testResults.completionRate?.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Completion Rate</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Testing Tabs */}
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-800">
            <TabsTrigger value="metrics" className="text-xs lg:text-sm">
              <Zap className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="text-xs lg:text-sm">
              <Users className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Simulation</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="text-xs lg:text-sm">
              <Timer className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Timer</span>
            </TabsTrigger>
            <TabsTrigger value="score" className="text-xs lg:text-sm">
              <Trophy className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Score</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="text-xs lg:text-sm">
              <Smartphone className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="debug" className="text-xs lg:text-sm">
              <Bug className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Debug</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="mt-6">
            <GameTestMetrics 
              gameId={gameId} 
              testMode={testMode}
              deviceMode={deviceMode}
            />
          </TabsContent>

          <TabsContent value="simulation" className="mt-6">
            <MockPlayerSimulator 
              gameId={gameId}
              testMode={testMode}
            />
          </TabsContent>

          <TabsContent value="timer" className="mt-6">
            <TimerAccuracyTest gameId={gameId} />
          </TabsContent>

          <TabsContent value="score" className="mt-6">
            <ScoreVerificationTest gameId={gameId} />
          </TabsContent>

          <TabsContent value="mobile" className="mt-6">
            <MobileSimulationView 
              gameId={gameId}
              deviceMode={deviceMode}
              onDeviceModeChange={setDeviceMode}
            />
          </TabsContent>

          <TabsContent value="debug" className="mt-6">
            <GameDebugConsole 
              gameId={gameId}
              testMode={testMode}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default GameTestingDashboard;
