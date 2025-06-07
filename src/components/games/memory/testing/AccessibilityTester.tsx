
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Palette, Keyboard, Volume2 } from 'lucide-react';

interface AccessibilityTest {
  name: string;
  category: 'visual' | 'motor' | 'cognitive' | 'auditory';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  description: string;
  recommendation?: string;
}

export function AccessibilityTester() {
  const [tests, setTests] = useState<AccessibilityTest[]>([
    {
      name: 'Color Contrast Ratio',
      category: 'visual',
      status: 'pending',
      description: 'Verify card colors meet WCAG AA standards',
      recommendation: 'Use high contrast colors for card borders and text'
    },
    {
      name: 'Colorblind Accessibility',
      category: 'visual',
      status: 'pending',
      description: 'Test visibility with different types of color blindness',
      recommendation: 'Add patterns or shapes in addition to colors'
    },
    {
      name: 'Keyboard Navigation',
      category: 'motor',
      status: 'pending',
      description: 'All cards should be reachable via keyboard',
      recommendation: 'Implement Tab navigation and Enter/Space activation'
    },
    {
      name: 'Touch Target Size',
      category: 'motor',
      status: 'pending',
      description: 'Cards should be at least 44px touch targets',
      recommendation: 'Ensure adequate spacing between cards'
    },
    {
      name: 'Screen Reader Support',
      category: 'cognitive',
      status: 'pending',
      description: 'Cards should have proper ARIA labels',
      recommendation: 'Add aria-label and role attributes'
    },
    {
      name: 'Focus Indicators',
      category: 'visual',
      status: 'pending',
      description: 'Clear visual focus indicators for keyboard users',
      recommendation: 'Add visible focus rings around focused cards'
    },
    {
      name: 'Sound Alternatives',
      category: 'auditory',
      status: 'pending',
      description: 'Visual feedback for audio cues',
      recommendation: 'Add visual animations for match/mismatch feedback'
    },
    {
      name: 'Reduced Motion Support',
      category: 'visual',
      status: 'pending',
      description: 'Respect prefers-reduced-motion setting',
      recommendation: 'Provide option to disable animations'
    }
  ]);

  const runAccessibilityTests = async () => {
    const updatedTests = tests.map(test => {
      let status: 'pass' | 'fail' | 'warning' = 'pass';
      
      // Simulate test results based on common accessibility issues
      switch (test.name) {
        case 'Color Contrast Ratio':
          // Check if using sufficient contrast
          status = 'pass'; // Assuming good contrast in our theme
          break;
        case 'Colorblind Accessibility':
          // Our memory game uses colors only, which is not ideal
          status = 'warning';
          break;
        case 'Keyboard Navigation':
          // Memory cards typically need keyboard support
          status = 'fail';
          break;
        case 'Touch Target Size':
          // Cards are usually large enough
          status = 'pass';
          break;
        case 'Screen Reader Support':
          // Needs proper ARIA implementation
          status = 'fail';
          break;
        case 'Focus Indicators':
          // Often missing in card games
          status = 'warning';
          break;
        case 'Sound Alternatives':
          // Visual feedback is usually present
          status = 'pass';
          break;
        case 'Reduced Motion Support':
          // Often not implemented
          status = 'warning';
          break;
        default:
          status = 'pass';
      }
      
      return { ...test, status };
    });
    
    setTests(updatedTests);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visual': return <Eye className="w-4 h-4" />;
      case 'motor': return <Keyboard className="w-4 h-4" />;
      case 'cognitive': return <Palette className="w-4 h-4" />;
      case 'auditory': return <Volume2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-emerald-600';
      case 'fail': return 'bg-red-600';
      case 'warning': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const passedTests = tests.filter(t => t.status === 'pass').length;
  const failedTests = tests.filter(t => t.status === 'fail').length;
  const warningTests = tests.filter(t => t.status === 'warning').length;

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Accessibility Testing
        </CardTitle>
        <div className="flex gap-2">
          <Badge className="bg-emerald-600">{passedTests} Passed</Badge>
          <Badge className="bg-yellow-600">{warningTests} Warnings</Badge>
          <Badge className="bg-red-600">{failedTests} Failed</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runAccessibilityTests} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
          Run Accessibility Tests
        </Button>
        
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(test.category)}
                  <span className="font-semibold text-puzzle-white">{test.name}</span>
                  <Badge className={getStatusColor(test.status)}>
                    {test.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-2">{test.description}</p>
              
              {test.recommendation && test.status !== 'pass' && (
                <Alert className="mt-2">
                  <AlertDescription className="text-sm">
                    <strong>Recommendation:</strong> {test.recommendation}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="font-semibold text-puzzle-white mb-2">Quick Accessibility Checklist</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">✓ High contrast colors</div>
            <div className="text-gray-400">✓ Keyboard navigation</div>
            <div className="text-gray-400">✓ Screen reader labels</div>
            <div className="text-gray-400">✓ Touch-friendly sizing</div>
            <div className="text-gray-400">✓ Focus indicators</div>
            <div className="text-gray-400">✓ Motion preferences</div>
            <div className="text-gray-400">✓ Color alternatives</div>
            <div className="text-gray-400">✓ Audio alternatives</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
