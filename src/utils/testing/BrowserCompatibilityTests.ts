
// Import required types and utilities
import { TestReport, TestSuite, TestCategory } from './types/testTypes';
import { TEST_RESULTS } from './constants/testResults';

// Helper function to convert Date to timestamp number
const dateToTimestamp = (date: Date): number => {
  return date.getTime();
};

// Sample test report factory with proper timestamp type
export const createTestReport = (
  id: string, 
  name: string, 
  status: string, 
  results: any[],
  success: boolean
): TestReport => {
  return {
    id,
    name,
    status,
    results,
    success,
    timestamp: dateToTimestamp(new Date()),
    duration: 0
  };
};

// Sample test functions for browser compatibility
export const testChrome = (): TestReport => {
  return {
    id: 'chrome-test',
    name: 'Chrome Compatibility',
    status: TEST_RESULTS.VERIFIED,
    results: [true],
    success: true,
    timestamp: dateToTimestamp(new Date()),
    duration: 150,
    browser: {
      name: 'chrome',
      version: '90+'
    }
  };
};

export const testFirefox = (): TestReport => {
  return {
    id: 'firefox-test',
    name: 'Firefox Compatibility',
    status: TEST_RESULTS.VERIFIED,
    results: [true],
    success: true,
    timestamp: dateToTimestamp(new Date()),
    duration: 120,
    browser: {
      name: 'firefox',
      version: '88+'
    }
  };
};

export const testSafari = (): TestReport => {
  return {
    id: 'safari-test',
    name: 'Safari Compatibility',
    status: TEST_RESULTS.VERIFIED,
    results: [true],
    success: true,
    timestamp: dateToTimestamp(new Date()),
    duration: 180,
    browser: {
      name: 'safari',
      version: '14+'
    }
  };
};

export const testEdge = (): TestReport => {
  return {
    id: 'edge-test',
    name: 'Edge Compatibility',
    status: TEST_RESULTS.VERIFIED,
    results: [true],
    success: true,
    timestamp: dateToTimestamp(new Date()),
    duration: 140,
    browser: {
      name: 'edge',
      version: '90+'
    }
  };
};

export const testMobile = (): TestReport => {
  return {
    id: 'mobile-test',
    name: 'Mobile Browser Compatibility',
    status: TEST_RESULTS.VERIFIED,
    results: [true],
    success: true,
    timestamp: dateToTimestamp(new Date()),
    duration: 200,
    browser: {
      name: 'mobile',
      version: 'various'
    }
  };
};

export const testTablet = (): TestReport => {
  return {
    id: 'tablet-test',
    name: 'Tablet Browser Compatibility',
    status: TEST_RESULTS.VERIFIED,
    results: [true],
    success: true,
    timestamp: dateToTimestamp(new Date()),
    duration: 190,
    browser: {
      name: 'tablet',
      version: 'various'
    }
  };
};

export const testOldBrowsers = (): TestReport => {
  return {
    id: 'old-browsers-test',
    name: 'Legacy Browser Compatibility',
    status: TEST_RESULTS.FAILED,
    results: [false],
    success: false,
    timestamp: dateToTimestamp(new Date()),
    duration: 220,
    failureReason: 'Not compatible with IE 11 and older browsers',
    browser: {
      name: 'ie',
      version: '11'
    }
  };
};

// Create browser compatibility test category
export const getBrowserCompatibilityCategory = (): TestCategory => {
  return {
    id: 'browser-compatibility',
    name: 'Browser Compatibility',
    description: 'Tests for compatibility with different browsers',
    priority: 2
  };
};

// Create browser test suite
export const getBrowserTestSuite = (): TestSuite => {
  const category = getBrowserCompatibilityCategory();
  
  return {
    id: 'browser-test-suite',
    name: 'Browser Compatibility Tests',
    category,
    tests: [
      testChrome,
      testFirefox,
      testSafari,
      testEdge,
      testMobile,
      testTablet,
      testOldBrowsers
    ]
  };
};
