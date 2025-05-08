
import { TestReport } from './types/testTypes';

/**
 * Browser compatibility tests for the puzzle application
 */
export class BrowserCompatibilityTest {
  /**
   * Get browser information for testing
   */
  static getBrowserInfo(): Record<string, any> {
    const userAgent = navigator.userAgent;
    const browserInfo = {
      name: this.getBrowserName(userAgent),
      version: this.getBrowserVersion(userAgent),
      os: this.getOperatingSystem(userAgent),
      mobile: this.isMobileDevice(),
      touchEnabled: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
    
    return browserInfo;
  }
  
  /**
   * Get browser name from user agent
   */
  private static getBrowserName(userAgent: string): string {
    if (userAgent.indexOf("Firefox") > -1) {
      return "Firefox";
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
      return "Samsung Internet";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      return "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
      return "Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
      return "Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } else {
      return "Unknown";
    }
  }
  
  /**
   * Get browser version from user agent
   */
  private static getBrowserVersion(userAgent: string): string {
    const browser = this.getBrowserName(userAgent);
    let versionRegex: RegExp;
    
    switch (browser) {
      case "Firefox":
        versionRegex = /Firefox\/([0-9.]+)/;
        break;
      case "Samsung Internet":
        versionRegex = /SamsungBrowser\/([0-9.]+)/;
        break;
      case "Opera":
        versionRegex = /OPR\/([0-9.]+)/;
        break;
      case "Internet Explorer":
        versionRegex = /rv:([0-9.]+)/;
        break;
      case "Edge":
        versionRegex = /Edge\/([0-9.]+)/;
        break;
      case "Chrome":
        versionRegex = /Chrome\/([0-9.]+)/;
        break;
      case "Safari":
        versionRegex = /Version\/([0-9.]+)/;
        break;
      default:
        return "Unknown";
    }
    
    const match = userAgent.match(versionRegex);
    return match ? match[1] : "Unknown";
  }
  
  /**
   * Get operating system from user agent
   */
  private static getOperatingSystem(userAgent: string): string {
    if (userAgent.indexOf("Win") !== -1) return "Windows";
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    if (userAgent.indexOf("Android") !== -1) return "Android";
    if (userAgent.indexOf("iOS") !== -1 || userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) return "iOS";
    return "Unknown";
  }
  
  /**
   * Check if device is mobile
   */
  private static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || (window.innerWidth <= 768);
  }
  
  /**
   * Run standard browser compatibility tests
   */
  static async runCompatibilityTests(): Promise<TestReport> {
    const browserInfo = this.getBrowserInfo();
    const tests = [
      {
        testName: "WebGL Support",
        result: this.testWebGL(),
        importance: "critical"
      },
      {
        testName: "Canvas Support",
        result: this.testCanvas(),
        importance: "critical"
      },
      {
        testName: "Drag and Drop API",
        result: this.testDragAndDrop(),
        importance: "critical"
      },
      {
        testName: "LocalStorage Access",
        result: this.testLocalStorage(),
        importance: "high"
      },
      {
        testName: "Touch Events",
        result: browserInfo.touchEnabled,
        importance: "medium"
      },
      {
        testName: "Audio Support",
        result: this.testAudio(),
        importance: "low"
      }
    ];
    
    // Evaluate overall compatibility
    const criticalTests = tests.filter(test => test.importance === "critical");
    const criticalPassing = criticalTests.every(test => test.result);
    const success = criticalPassing;
    const failureReason = !criticalPassing
      ? `Critical features not supported in this browser`
      : undefined;
    
    return {
      id: `browser-compat-${Date.now()}`,
      name: "Browser Compatibility",
      status: success ? "VERIFIED" : "FAILED",
      results: tests.map(test => test.result),
      timestamp: Date.now(),
      duration: 0,
      success,
      failureReason,
      browser: browserInfo,
      tests
    };
  }
  
  /**
   * Test WebGL support
   */
  private static testWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Test Canvas support
   */
  private static testCanvas(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Test Drag and Drop API support
   */
  private static testDragAndDrop(): boolean {
    const div = document.createElement('div');
    return 'draggable' in div && 'ondragstart' in div && 'ondrop' in div;
  }
  
  /**
   * Test localStorage support
   */
  private static testLocalStorage(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Test audio support
   */
  private static testAudio(): boolean {
    try {
      const audio = document.createElement('audio');
      return !!audio.canPlayType;
    } catch (e) {
      return false;
    }
  }
}
