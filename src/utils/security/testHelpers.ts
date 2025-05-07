
/**
 * @file Security Testing Helpers
 * These utilities help test security features across the application
 */

import { supabase } from '@/integrations/supabase/client';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Security Event Types for the application
 */
export enum SecurityEventType {
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  PASSWORD_RESET = 'password_reset',
  PROFILE_UPDATE = 'profile_update',
  ROLE_CHANGE = 'role_change',
  ADMIN_ACTION = 'admin_action',
  SECURITY_TEST = 'security_test'
}

/**
 * Types representing test verification results
 */
export type VerificationResult = {
  success: boolean;
  message: string;
  details?: Record<string, any>;
  status?: string;
  changeId?: string;
  description?: string;
};

/**
 * Security Test Runner
 * 
 * A utility class to run automated security tests and vulnerability checks
 */
export class SecurityTestRunner {
  private results: VerificationResult[] = [];
  private testsCompleted = 0;
  private testsPassed = 0;
  
  /**
   * Tests CSRF protection mechanisms
   * 
   * @returns Verification result
   */
  async testCsrfProtection(): Promise<VerificationResult> {
    this.testsCompleted++;
    debugLog('SecurityTestRunner', 'Running CSRF protection test', DebugLevel.INFO);
    
    try {
      // Get CSRF token from cookie if available
      const cookies = document.cookie.split(';')
        .map(cookie => cookie.trim().split('='))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}) as Record<string, string>;
        
      const csrfToken = cookies['csrf_token_visible'];
      
      if (!csrfToken) {
        return {
          success: false,
          message: 'CSRF token not found in cookies',
          details: { cookies }
        };
      }
      
      // Test CSRF validation endpoint
      const { data, error } = await supabase.functions.invoke('security-cookies', {
        body: {
          action: 'validateCsrfToken',
          token: csrfToken
        }
      });
      
      if (error || !data?.valid) {
        return {
          success: false,
          message: 'CSRF token validation failed',
          details: { error, response: data }
        };
      }
      
      this.testsPassed++;
      return {
        success: true,
        message: 'CSRF protection is properly implemented',
        details: { tokenPresent: true, validationSuccessful: true }
      };
    } catch (error) {
      return {
        success: false,
        message: `Exception during CSRF test: ${error instanceof Error ? error.message : String(error)}`,
        details: { error }
      };
    }
  }
  
  /**
   * Tests if authentication flow is secure
   * 
   * @returns Verification result
   */
  async testAuthenticationSecurity(): Promise<VerificationResult> {
    this.testsCompleted++;
    debugLog('SecurityTestRunner', 'Running authentication security test', DebugLevel.INFO);
    
    try {
      // Check if we have a session
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Test token refresh mechanism
      if (sessionData.session) {
        try {
          // Try to refresh session
          const { data, error } = await supabase.functions.invoke('auth-manager', {
            body: {
              action: 'refresh',
              token: sessionData.session.access_token
            }
          });
          
          if (error) {
            return {
              success: false,
              message: 'Token refresh mechanism failed',
              details: { error }
            };
          }
          
          this.testsPassed++;
          return {
            success: true,
            message: 'Authentication flow is secure and token refresh mechanism works',
            details: { tokenRefreshSuccessful: true }
          };
        } catch (error) {
          return {
            success: false,
            message: 'Exception during authentication test',
            details: { error }
          };
        }
      }
      
      this.testsPassed++;
      return {
        success: true,
        message: 'No active session to test',
        details: { sessionPresent: false }
      };
    } catch (error) {
      return {
        success: false,
        message: `Exception during authentication test: ${error instanceof Error ? error.message : String(error)}`,
        details: { error }
      };
    }
  }
  
  /**
   * Tests if protected admin email recognition is working
   * 
   * @returns Verification result
   */
  async testProtectedAdminRecognition(): Promise<VerificationResult> {
    this.testsCompleted++;
    debugLog('SecurityTestRunner', 'Running protected admin recognition test', DebugLevel.INFO);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        this.testsPassed++;
        return {
          success: true,
          message: 'No user logged in to test admin recognition',
          details: { userPresent: false }
        };
      }
      
      // Check if the current user is the protected admin
      const isProtectedAdminUser = isProtectedAdmin(user.email);
      
      if (isProtectedAdminUser) {
        // Verify admin access via security config service
        const { data, error } = await supabase.functions.invoke('security-config-service', {
          body: {
            action: 'validateAdminAccess'
          }
        });
        
        if (error || !data?.isAdmin) {
          return {
            success: false,
            message: 'Protected admin email not recognized by security service',
            details: { error, response: data, userEmail: user.email }
          };
        }
        
        this.testsPassed++;
        return {
          success: true,
          message: 'Protected admin email recognition is working correctly',
          details: { 
            userEmail: user.email,
            isProtectedAdmin: isProtectedAdminUser,
            recognizedByService: true
          }
        };
      }
      
      this.testsPassed++;
      return {
        success: true,
        message: 'Current user is not a protected admin',
        details: { userEmail: user.email, isProtectedAdmin: false }
      };
    } catch (error) {
      return {
        success: false,
        message: `Exception during protected admin test: ${error instanceof Error ? error.message : String(error)}`,
        details: { error }
      };
    }
  }
  
  /**
   * Tests security event logging functionality
   * 
   * @returns Verification result
   */
  async testSecurityEventLogging(): Promise<VerificationResult> {
    this.testsCompleted++;
    debugLog('SecurityTestRunner', 'Running security event logging test', DebugLevel.INFO);
    
    try {
      // Create a test security event
      const testEvent = {
        eventType: SecurityEventType.SECURITY_TEST,
        severity: 'info',
        details: {
          testId: `test-${Date.now()}`,
          testName: 'Security Event Logging Test'
        }
      };
      
      // Attempt to log the event via the edge function
      const { data, error } = await supabase.functions.invoke('security-events', {
        body: {
          action: 'log',
          event_type: testEvent.eventType,
          severity: testEvent.severity,
          event_details: testEvent.details
        }
      });
      
      if (error) {
        return {
          success: false,
          message: 'Failed to log security event',
          details: { error, testEvent }
        };
      }
      
      this.testsPassed++;
      return {
        success: true,
        message: 'Security event logging is functional',
        details: { response: data, testEvent }
      };
    } catch (error) {
      return {
        success: false,
        message: `Exception during security event test: ${error instanceof Error ? error.message : String(error)}`,
        details: { error }
      };
    }
  }
  
  /**
   * Runs all security tests
   * 
   * @returns Array of verification results
   */
  async runAllTests(): Promise<VerificationResult[]> {
    this.results = [];
    this.testsCompleted = 0;
    this.testsPassed = 0;
    
    debugLog('SecurityTestRunner', 'Starting security test suite', DebugLevel.INFO);
    
    // Add test results to the collection
    this.results.push(await this.testCsrfProtection());
    this.results.push(await this.testAuthenticationSecurity());
    this.results.push(await this.testProtectedAdminRecognition());
    this.results.push(await this.testSecurityEventLogging());
    
    debugLog('SecurityTestRunner', 'Security test suite complete', DebugLevel.INFO, {
      passed: this.testsPassed,
      total: this.testsCompleted,
      success: this.allTestsPassed()
    });
    
    return this.results;
  }
  
  /**
   * Returns test results
   * 
   * @returns Array of verification results
   */
  getResults(): VerificationResult[] {
    return this.results;
  }
  
  /**
   * Checks if all tests passed
   * 
   * @returns Boolean indicating if all tests passed
   */
  allTestsPassed(): boolean {
    return this.results.every(result => result.success);
  }
  
  /**
   * Get test statistics
   * 
   * @returns Test statistics object
   */
  getTestStats(): { passed: number; total: number; percentage: number } {
    return {
      passed: this.testsPassed,
      total: this.testsCompleted,
      percentage: this.testsCompleted > 0 ? (this.testsPassed / this.testsCompleted) * 100 : 0
    };
  }
  
  /**
   * Static method to quickly validate security implementation
   * 
   * @returns Verification result
   */
  static async validateSecurityImplementation(): Promise<VerificationResult> {
    const runner = new SecurityTestRunner();
    await runner.runAllTests();
    
    const stats = runner.getTestStats();
    
    if (runner.allTestsPassed()) {
      return {
        success: true,
        message: `All ${stats.total} security tests passed`,
        details: { results: runner.getResults() },
        status: 'VERIFIED',
        changeId: 'security-validation',
        description: 'Security implementation validation'
      };
    } else {
      return {
        success: false,
        message: `${stats.total - stats.passed} of ${stats.total} security tests failed`,
        details: { results: runner.getResults() },
        status: 'FAILED',
        changeId: 'security-validation',
        description: 'Security implementation validation'
      };
    }
  }
}
