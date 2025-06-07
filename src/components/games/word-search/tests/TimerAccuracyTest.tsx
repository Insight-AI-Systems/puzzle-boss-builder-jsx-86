
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Square } from 'lucide-react';

interface TimerReading {
  expectedTime: number;
  actualTime: number;
  difference: number;
  accuracy: number;
}

export const TimerAccuracyTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [readings, setReadings] = useState<TimerReading[]>([]);
  const [currentReading, setCurrentReading] = useState<TimerReading | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const expectedTimeRef = useRef<number>(0);

  const startTimerTest = () => {
    setIsRunning(true);
    setReadings([]);
    startTimeRef.current = performance.now();
    expectedTimeRef.current = 0;

    intervalRef.current = window.setInterval(() => {
      expectedTimeRef.current += 100; // Expected 100ms intervals
      const actualElapsed = performance.now() - startTimeRef.current;
      const difference = actualElapsed - expectedTimeRef.current;
      const accuracy = Math.max(0, 100 - Math.abs(difference / expectedTimeRef.current) * 100);

      const reading: TimerReading = {
        expectedTime: expectedTimeRef.current,
        actualTime: actualElapsed,
        difference,
        accuracy
      };

      setCurrentReading(reading);
      setReadings(prev => [...prev.slice(-19), reading]); // Keep last 20 readings
    }, 100);
  };

  const stopTimerTest = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const averageAccuracy = readings.length > 0 
    ? readings.reduce((sum, r) => sum + r.accuracy, 0) / readings.length 
    : 0;

  const maxDifference = readings.length > 0 
    ? Math.max(...readings.map(r => Math.abs(r.difference))) 
    : 0;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 99) return 'text-green-400';
    if (accuracy >= 95) return 'text-puzzle-gold';
    return 'text-red-400';
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timer Accuracy Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Test timer precision across devices
          </div>
          <div className="flex gap-2">
            <Button
              onClick={isRunning ? stopTimerTest : startTimerTest}
              size="sm"
              className={isRunning 
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
              }
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>

        {currentReading && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className={`text-lg font-bold ${getAccuracyColor(currentReading.accuracy)}`}>
                {currentReading.accuracy.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400">Current Accuracy</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-puzzle-aqua">
                {Math.abs(currentReading.difference).toFixed(2)}ms
              </div>
              <div className="text-xs text-gray-400">Timing Difference</div>
            </div>
          </div>
        )}

        {readings.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className={`text-lg font-bold ${getAccuracyColor(averageAccuracy)}`}>
                  {averageAccuracy.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-400">Average Accuracy</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-puzzle-gold">
                  {maxDifference.toFixed(2)}ms
                </div>
                <div className="text-xs text-gray-400">Max Drift</div>
              </div>
            </div>

            <div className="max-h-32 overflow-y-auto space-y-1">
              {readings.slice(-10).map((reading, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 rounded p-2 text-sm">
                  <span className="text-puzzle-white">
                    {(reading.expectedTime / 1000).toFixed(2)}s
                  </span>
                  <Badge className={
                    reading.accuracy >= 99 
                      ? 'bg-green-500/20 text-green-400'
                      : reading.accuracy >= 95
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }>
                    {reading.accuracy.toFixed(1)}%
                  </Badge>
                  <span className="text-gray-400">
                    {reading.difference > 0 ? '+' : ''}{reading.difference.toFixed(2)}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Timer should maintain millisecond precision for competitive play.
          Target accuracy: {'>'}99% for optimal user experience.
        </div>
      </CardContent>
    </Card>
  );
};
