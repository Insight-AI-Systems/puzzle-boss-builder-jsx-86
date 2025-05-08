
import { TestReport } from './types/testTypes';
import { performanceMonitor } from '@/utils/performance/PerformanceMonitor';

// Helper function to generate a test ID
const generateTestId = () => `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  mobile: boolean;
}

// Function to detect browser information
const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  let os = 'Unknown';
  let mobile = false;

  // Detect OS
  if (userAgent.indexOf('Win') !== -1) os = 'Windows';
  if (userAgent.indexOf('Mac') !== -1) os = 'MacOS';
  if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
  if (userAgent.indexOf('Android') !== -1) {
    os = 'Android';
    mobile = true;
  }
  if (userAgent.indexOf('iOS') !== -1) {
    os = 'iOS';
    mobile = true;
  }

  // Detect browser
  if (userAgent.indexOf('Chrome') !== -1) {
    browserName = 'Chrome';
    browserVersion = userAgent.substring(userAgent.indexOf('Chrome/') + 7).split(' ')[0];
  } else if (userAgent.indexOf('Firefox') !== -1) {
    browserName = 'Firefox';
    browserVersion = userAgent.substring(userAgent.indexOf('Firefox/') + 8).split(' ')[0];
  } else if (userAgent.indexOf('Safari') !== -1) {
    browserName = 'Safari';
    browserVersion = userAgent.substring(userAgent.indexOf('Safari/') + 7).split(' ')[0];
  } else if (userAgent.indexOf('Edge') !== -1) {
    browserName = 'Edge';
    browserVersion = userAgent.substring(userAgent.indexOf('Edge/') + 5).split(' ')[0];
  } else if (userAgent.indexOf('MSIE') !== -1 || document.documentMode) {
    browserName = 'IE';
    browserVersion = userAgent.substring(userAgent.indexOf('MSIE') + 4).split(';')[0];
  }

  return { name: browserName, version: browserVersion, os, mobile };
};

const browserInfo = detectBrowser();

// Test functions
const compatibilityTests = [
  {
    name: 'localStorage Support',
    test: () => typeof window.localStorage !== 'undefined',
    importance: 'high'
  },
  {
    name: 'WebSockets Support',
    test: () => typeof WebSocket !== 'undefined',
    importance: 'high'
  },
  {
    name: 'Fetch API Support',
    test: () => typeof fetch !== 'undefined',
    importance: 'high'
  },
  {
    name: 'Promises Support',
    test: () => typeof Promise !== 'undefined',
    importance: 'high'
  },
  {
    name: 'Arrow Functions Support',
    test: () => {
      try {
        // tslint:disable-next-line:no-eval
        eval('() => 1');
        return true;
      } catch (e) {
        return false;
      }
    },
    importance: 'medium'
  },
  {
    name: 'ES6 Classes Support',
    test: () => {
      try {
        // tslint:disable-next-line:no-eval
        eval('class Foo {}');
        return true;
      } catch (e) {
        return false;
      }
    },
    importance: 'medium'
  },
  {
    name: 'Template Literals Support',
    test: () => {
      try {
        // tslint:disable-next-line:no-eval
        eval('`hello ${1}`');
        return true;
      } catch (e) {
        return false;
      }
    },
    importance: 'medium'
  },
  {
    name: 'async/await Support',
    test: () => {
      try {
        // tslint:disable-next-line:no-eval
        eval('async function test() { await Promise.resolve(); }');
        return true;
      } catch (e) {
        return false;
      }
    },
    importance: 'medium'
  },
  {
    name: 'CSS Variables Support',
    test: () => window.CSS && window.CSS.supports('--fake-variable', '0'),
    importance: 'low'
  },
  {
    name: 'Touch Events Support',
    test: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    importance: 'low'
  }
];

// Update the createTestReport function to include required fields
const createTestReport = (testResults: any): TestReport => {
  return {
    id: generateTestId(),
    name: 'Browser Compatibility Tests',
    status: testResults.success ? 'VERIFIED' : 'FAILED',
    results: testResults.results,
    timestamp: Date.now(),
    duration: testResults.duration || 0,
    success: testResults.success,
    passedTests: testResults.results.filter((r: any) => r.result).length,
    totalTests: testResults.results.length,
    failureReason: testResults.success ? '' : 'Some browser compatibility tests failed',
    browser: {
      name: browserInfo.name,
      version: browserInfo.version,
      os: browserInfo.os,
      mobile: browserInfo.mobile,
      touchEnabled: ('ontouchstart' in window)
    },
    tests: testResults.results.map((result: any) => ({
      testName: result.name,
      result: result.result,
      importance: result.importance
    })),
    taskResults: {} // Initialize empty taskResults
  };
};

// Run the tests
export const runBrowserCompatibilityTests = (): Promise<TestReport> => {
  return new Promise((resolve) => {
    performanceMonitor.markStart('browserCompatibilityTests');

    const testResults = compatibilityTests.map(test => {
      const result = test.test();
      return {
        name: test.name,
        result,
        importance: test.importance
      };
    });

    const success = testResults.every(result => result.result);
    const duration = performanceMonitor.markEnd('browserCompatibilityTests');

    const report = createTestReport({ success, duration, results: testResults });
    resolve(report);
  });
};
