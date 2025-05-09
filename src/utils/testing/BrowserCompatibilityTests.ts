
import { TestReport, TestSuite } from './types/testTypes';

export interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  mobile: boolean;
  touchEnabled: boolean;
  screenWidth: number;
  screenHeight: number;
}

export interface CompatibilityTestResult {
  browser: BrowserInfo;
  tests: TestReport[];
  success: boolean;
  failureReason?: string;
}

export class BrowserCompatibilityTests {
  static getBrowserInfo(): BrowserInfo {
    const ua = navigator.userAgent;
    const mobile = /Mobile|Android|iPhone|iPad|iPod|Windows Phone/.test(ua);
    const touchEnabled = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) || 
                          ('msMaxTouchPoints' in navigator && (navigator as any).msMaxTouchPoints > 0);
    
    // Browser detection
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let os = 'Unknown';
    
    // Chrome
    const chromeMatch = ua.match(/(Chrome|Chromium)\/([0-9.]+)/);
    if (chromeMatch) {
      browserName = chromeMatch[1];
      browserVersion = chromeMatch[2];
    }
    
    // Firefox
    const firefoxMatch = ua.match(/Firefox\/([0-9.]+)/);
    if (firefoxMatch) {
      browserName = 'Firefox';
      browserVersion = firefoxMatch[1];
    }
    
    // Safari
    const safariMatch = ua.match(/Version\/([0-9.]+).*Safari/);
    if (safariMatch) {
      browserName = 'Safari';
      browserVersion = safariMatch[1];
    }
    
    // Edge (Chromium-based)
    const edgeMatch = ua.match(/Edg\/([0-9.]+)/);
    if (edgeMatch) {
      browserName = 'Edge';
      browserVersion = edgeMatch[1];
    }
    
    // OS detection
    if (/Windows/.test(ua)) {
      os = 'Windows';
    } else if (/Macintosh/.test(ua)) {
      os = 'macOS';
    } else if (/Linux/.test(ua)) {
      os = 'Linux';
    } else if (/Android/.test(ua)) {
      os = 'Android';
    } else if (/iPhone|iPad|iPod/.test(ua)) {
      os = 'iOS';
    }
    
    return {
      name: browserName,
      version: browserVersion,
      os,
      mobile,
      touchEnabled,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
  }
  
  static async runCompatibilityTests(): Promise<CompatibilityTestResult> {
    const browser = this.getBrowserInfo();
    const tests: TestReport[] = [];
    let success = true;
    let failureReason = '';
    
    try {
      // Test 1: Basic canvas support
      const canvasSupported = !!document.createElement('canvas').getContext;
      tests.push({
        testId: 'canvas-support',
        testName: 'Canvas Support',
        result: canvasSupported,
        duration: 0,
        timestamp: new Date(),
        details: { supported: canvasSupported }
      });
      
      if (!canvasSupported) {
        success = false;
        failureReason = 'Canvas not supported by this browser';
      }
      
      // Test 2: LocalStorage support
      let localStorageSupported = false;
      try {
        const testKey = `__test_${Date.now()}`;
        localStorage.setItem(testKey, 'test');
        localStorageSupported = localStorage.getItem(testKey) === 'test';
        localStorage.removeItem(testKey);
      } catch (e) {
        localStorageSupported = false;
      }
      
      tests.push({
        testId: 'localstorage-support',
        testName: 'LocalStorage Support',
        result: localStorageSupported,
        duration: 0,
        timestamp: new Date(),
        details: { supported: localStorageSupported }
      });
      
      if (!localStorageSupported) {
        success = false;
        failureReason = 'LocalStorage not supported by this browser';
      }
      
      // Test 3: Drag and Drop API support
      const dndSupported = 'draggable' in document.createElement('div');
      tests.push({
        testId: 'dnd-support',
        testName: 'Drag and Drop API Support',
        result: dndSupported,
        duration: 0,
        timestamp: new Date(),
        details: { supported: dndSupported }
      });
      
      if (!dndSupported && !browser.touchEnabled) {
        success = false;
        failureReason = 'Drag and Drop API not supported by this browser';
      }
      
      // Test 4: Touch events support (for mobile)
      const touchSupported = browser.touchEnabled;
      tests.push({
        testId: 'touch-support',
        testName: 'Touch Events Support',
        result: true, // Not a failure case, just informational
        duration: 0,
        timestamp: new Date(),
        details: { supported: touchSupported }
      });
      
      // Test 5: Audio API support
      const audioSupported = !!document.createElement('audio').canPlayType;
      tests.push({
        testId: 'audio-support',
        testName: 'Audio API Support',
        result: audioSupported,
        duration: 0,
        timestamp: new Date(),
        details: { supported: audioSupported }
      });
      
      if (!audioSupported) {
        // Not a failure, sound is not critical
        console.warn('Audio not supported by this browser');
      }
      
      // Test 6: WebGL support for potential future 3D puzzles
      let webglSupported = false;
      try {
        const canvas = document.createElement('canvas');
        webglSupported = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        webglSupported = false;
      }
      
      tests.push({
        testId: 'webgl-support',
        testName: 'WebGL Support',
        result: true, // Not a failure case, just informational
        duration: 0,
        timestamp: new Date(),
        details: { supported: webglSupported }
      });
      
      // Test 7: Check screen size viability
      const screenSizeViable = browser.screenWidth >= 320 && browser.screenHeight >= 480;
      tests.push({
        testId: 'screen-size-viability',
        testName: 'Screen Size Viability',
        result: screenSizeViable,
        duration: 0,
        timestamp: new Date(),
        details: { 
          width: browser.screenWidth, 
          height: browser.screenHeight,
          viable: screenSizeViable
        }
      });
      
      if (!screenSizeViable) {
        success = false;
        failureReason = 'Screen size too small for optimal gameplay';
      }
      
    } catch (error) {
      success = false;
      failureReason = `Unexpected error during compatibility testing: ${error instanceof Error ? error.message : String(error)}`;
    }
    
    return {
      browser,
      tests,
      success,
      failureReason: success ? undefined : failureReason
    };
  }
  
  static getCompatibilityTestSuite(): TestSuite {
    return {
      id: 'browser-compatibility',
      name: 'Browser Compatibility Tests',
      description: 'Tests for browser compatibility with puzzle game features',
      category: 'integration',
      testIds: [
        'canvas-support',
        'localstorage-support',
        'dnd-support',
        'touch-support',
        'audio-support',
        'webgl-support',
        'screen-size-viability'
      ]
    };
  }
}
