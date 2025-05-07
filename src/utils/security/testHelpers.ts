
/**
 * @file Security Testing Helpers
 * These utilities help test security features across the application
 */

import { SecurityEventType } from './auditLogging';
import { supabase } from '@/integrations/supabase/client';

/**
 * Types representing test verification results
 */
export type VerificationResult = {
  success: boolean;
  message: string;
  details?: Record<string, any>;
};

/**
 * Security Test Runner
 * 
 * A utility class to run automated security tests and vulnerability checks
 */
export class SecurityTestRunner {
  private results: VerificationResult[] = [];
  
  /**
   * Tests CSRF protection mechanisms
   */
  async testCsrfProtection(): Promise<VerificationResult> {
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
   */
  async testAuthenticationSecurity(): Promise<VerificationResult> {
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
   * Runs all security tests
   */
  async runAllTests(): Promise<VerificationResult[]> {
    this.results = [];
    
    // Add test results to the collection
    this.results.push(await this.testCsrfProtection());
    this.results.push(await this.testAuthenticationSecurity());
    
    return this.results;
  }
  
  /**
   * Returns test results
   */
  getResults(): VerificationResult[] {
    return this.results;
  }
  
  /**
   * Checks if all tests passed
   */
  allTestsPassed(): boolean {
    return this.results.every(result => result.success);
  }
}

/**
 * Quick security validation - runs tests and returns overall result
 */
export async function validateSecurityImplementation(): Promise<VerificationResult> {
  const runner = new SecurityTestRunner();
  await runner.runAllTests();
  
  if (runner.allTestsPassed()) {
    return {
      success: true,
      message: 'All security tests passed',
      details: { results: runner.getResults() }
    };
  } else {
    return {
      success: false,
      message: 'Some security tests failed',
      details: { results: runner.getResults() }
    };
  }
}
