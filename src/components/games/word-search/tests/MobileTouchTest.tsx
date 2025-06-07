
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Target, CheckCircle } from 'lucide-react';

interface TouchEvent {
  type: 'start' | 'move' | 'end';
  x: number;
  y: number;
  timestamp: number;
}

interface TouchTestResult {
  gestureType: string;
  success: boolean;
  duration: number;
  accuracy: number;
}

export const MobileTouchTest: React.FC = () => {
  const [isTestActive, setIsTestActive] = useState(false);
  const [touchEvents, setTouchEvents] = useState<TouchEvent[]>([]);
  const [testResults, setTestResults] = useState<TouchTestResult[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const testAreaRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);

  const testScenarios = [
    { type: 'tap', instruction: 'Tap the center of the test area' },
    { type: 'swipe-horizontal', instruction: 'Swipe horizontally across the area' },
    { type: 'swipe-vertical', instruction: 'Swipe vertically across the area' },
    { type: 'swipe-diagonal', instruction: 'Swipe diagonally across the area' },
    { type: 'long-press', instruction: 'Long press and hold for 2 seconds' }
  ];

  const [currentScenario, setCurrentScenario] = useState(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const rect = testAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const touchEvent: TouchEvent = {
      type: 'start',
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: performance.now()
    };

    setTouchEvents([touchEvent]);
    startTimeRef.current = performance.now();
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const rect = testAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const touchEvent: TouchEvent = {
      type: 'move',
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: performance.now()
    };

    setTouchEvents(prev => [...prev, touchEvent]);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const rect = testAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : 
                   'clientX' in e ? e.clientX : 0;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : 
                   'clientY' in e ? e.clientY : 0;

    const touchEvent: TouchEvent = {
      type: 'end',
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: performance.now()
    };

    const allEvents = [...touchEvents, touchEvent];
    const duration = performance.now() - startTimeRef.current;

    // Analyze the gesture
    const result = analyzeGesture(allEvents, testScenarios[currentScenario].type, duration);
    setTestResults(prev => [...prev, result]);

    // Move to next scenario or complete test
    if (currentScenario < testScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setTouchEvents([]);
    } else {
      setIsTestActive(false);
      setCurrentInstruction('Test completed!');
    }
  };

  const analyzeGesture = (events: TouchEvent[], expectedType: string, duration: number): TouchTestResult => {
    if (events.length < 2) {
      return {
        gestureType: expectedType,
        success: false,
        duration,
        accuracy: 0
      };
    }

    const startEvent = events[0];
    const endEvent = events[events.length - 1];
    const deltaX = Math.abs(endEvent.x - startEvent.x);
    const deltaY = Math.abs(endEvent.y - startEvent.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let success = false;
    let accuracy = 0;

    switch (expectedType) {
      case 'tap':
        success = distance < 20 && duration < 500;
        accuracy = success ? Math.max(0, 100 - distance * 5) : 0;
        break;
      case 'swipe-horizontal':
        success = deltaX > 50 && deltaY < 30;
        accuracy = success ? Math.min(100, (deltaX / Math.max(deltaY, 1)) * 10) : 0;
        break;
      case 'swipe-vertical':
        success = deltaY > 50 && deltaX < 30;
        accuracy = success ? Math.min(100, (deltaY / Math.max(deltaX, 1)) * 10) : 0;
        break;
      case 'swipe-diagonal':
        success = distance > 70 && Math.abs(deltaX - deltaY) < 30;
        accuracy = success ? Math.max(0, 100 - Math.abs(deltaX - deltaY) * 2) : 0;
        break;
      case 'long-press':
        success = distance < 20 && duration > 1500;
        accuracy = success ? Math.min(100, duration / 20) : 0;
        break;
    }

    return {
      gestureType: expectedType,
      success,
      duration,
      accuracy: Math.min(100, accuracy)
    };
  };

  const startTest = () => {
    setIsTestActive(true);
    setCurrentScenario(0);
    setTestResults([]);
    setTouchEvents([]);
    setCurrentInstruction(testScenarios[0].instruction);
  };

  const successRate = testResults.length > 0 
    ? (testResults.filter(r => r.success).length / testResults.length) * 100 
    : 0;

  const averageAccuracy = testResults.length > 0 
    ? testResults.reduce((sum, r) => sum + r.accuracy, 0) / testResults.length 
    : 0;

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile Touch Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Test touch and drag interactions
          </div>
          <Button
            onClick={startTest}
            disabled={isTestActive}
            size="sm"
            className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
          >
            {isTestActive ? 'Testing...' : 'Start Test'}
          </Button>
        </div>

        {isTestActive && (
          <div className="space-y-3">
            <div className="text-center">
              <Badge className="bg-puzzle-aqua/20 text-puzzle-aqua">
                Step {currentScenario + 1} of {testScenarios.length}
              </Badge>
              <div className="text-sm text-puzzle-white mt-2">
                {currentInstruction}
              </div>
            </div>

            <div
              ref={testAreaRef}
              className="h-32 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
            >
              <Target className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-400">
                  {successRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-puzzle-aqua">
                  {averageAccuracy.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">Avg Accuracy</div>
              </div>
            </div>

            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 rounded p-2">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Target className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-sm text-puzzle-white capitalize">
                      {result.gestureType.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={result.success 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                    }>
                      {result.accuracy.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {result.duration.toFixed(0)}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Touch interactions must be responsive and accurate for mobile gameplay.
          Target: {'>'}95% success rate across all gesture types.
        </div>
      </CardContent>
    </Card>
  );
};
