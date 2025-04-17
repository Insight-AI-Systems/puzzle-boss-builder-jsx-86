
import { formatTime } from '@/components/puzzles/hooks/usePuzzleState';
import { getImagePieceStyle } from '@/components/puzzles/utils/pieceStyleUtils';
import { getRotationStyle } from '@/components/puzzles/utils/pieceRotationUtils';
import { BrowserCompatibilityTests } from './BrowserCompatibilityTests';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export class PuzzleTestRunner {
  static async runTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      // Run simple utility function tests that don't require a full test environment
      results.push(this.testFormatTime());
      results.push(this.testImagePieceStyle());
      results.push(this.testRotationStyle());
      
      // Run browser compatibility tests
      const compatibilityResult = await BrowserCompatibilityTests.runCompatibilityTests();
      results.push({
        name: 'Browser Compatibility',
        passed: compatibilityResult.success,
        message: compatibilityResult.success 
          ? 'Browser is compatible with all required features'
          : compatibilityResult.failureReason
      });
      
      return results;
    } catch (error) {
      console.error('Error running puzzle tests:', error);
      results.push({
        name: 'Test Runner',
        passed: false,
        message: `Test execution failed: ${error instanceof Error ? error.message : String(error)}`
      });
      return results;
    }
  }
  
  private static testFormatTime(): TestResult {
    try {
      const tests = [
        { input: 0, expected: '00:00' },
        { input: 30, expected: '00:30' },
        { input: 60, expected: '01:00' },
        { input: 90, expected: '01:30' },
        { input: 3661, expected: '61:01' }
      ];
      
      for (const test of tests) {
        const result = formatTime(test.input);
        if (result !== test.expected) {
          return {
            name: 'Format Time',
            passed: false,
            message: `Expected formatTime(${test.input}) to be "${test.expected}", got "${result}"`
          };
        }
      }
      
      return {
        name: 'Format Time',
        passed: true,
        message: 'All format time tests passed'
      };
    } catch (error) {
      return {
        name: 'Format Time',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  private static testImagePieceStyle(): TestResult {
    try {
      const testPiece = {
        id: 'piece-0',
        position: 0,
        originalPosition: 0,
        isDragging: false
      };
      
      const result = getImagePieceStyle(testPiece, 'https://example.com/image.jpg', 3);
      
      if (!result.backgroundImage) {
        return {
          name: 'Image Piece Style',
          passed: false,
          message: 'Missing backgroundImage property'
        };
      }
      
      if (!result.backgroundSize) {
        return {
          name: 'Image Piece Style',
          passed: false,
          message: 'Missing backgroundSize property'
        };
      }
      
      if (result.backgroundPosition !== '0% 0%') {
        return {
          name: 'Image Piece Style',
          passed: false,
          message: `Expected backgroundPosition to be "0% 0%", got "${result.backgroundPosition}"`
        };
      }
      
      return {
        name: 'Image Piece Style',
        passed: true,
        message: 'Image piece style calculation is correct'
      };
    } catch (error) {
      return {
        name: 'Image Piece Style',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  private static testRotationStyle(): TestResult {
    try {
      const rotations = [0, 90, 180, 270, undefined];
      const expected = [
        'rotate(0deg)',
        'rotate(90deg)',
        'rotate(180deg)',
        'rotate(270deg)',
        'rotate(0deg)'
      ];
      
      for (let i = 0; i < rotations.length; i++) {
        const result = getRotationStyle(rotations[i]);
        
        if (!result.transform) {
          return {
            name: 'Rotation Style',
            passed: false,
            message: 'Missing transform property'
          };
        }
        
        if (result.transform !== expected[i]) {
          return {
            name: 'Rotation Style',
            passed: false,
            message: `Expected transform to be "${expected[i]}", got "${result.transform}"`
          };
        }
      }
      
      return {
        name: 'Rotation Style',
        passed: true,
        message: 'Rotation style calculation is correct'
      };
    } catch (error) {
      return {
        name: 'Rotation Style',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  static runBrowserCompatibilityTest(): Promise<TestResult> {
    return BrowserCompatibilityTests.runCompatibilityTests().then(result => {
      return {
        name: 'Browser Compatibility',
        passed: result.success,
        message: result.success 
          ? 'Browser is compatible with all required features'
          : result.failureReason
      };
    }).catch(error => {
      return {
        name: 'Browser Compatibility',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : String(error)}`
      };
    });
  }
  
  static getBrowserInfo() {
    return BrowserCompatibilityTests.getBrowserInfo();
  }
}
