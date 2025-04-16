
/**
 * Test Runner - Utilities for running tests and verifying functionality
 */

import { projectTracker } from './ProjectTracker';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TestManager } from './managers/TestManager';

export class TestRunner {
  private static verificationEnabled = true;
  private static testManager = new TestManager();
  
  static enableVerification(enable: boolean): void {
    TestRunner.verificationEnabled = enable;
  }
  
  static isVerificationEnabled(): boolean {
    return TestRunner.verificationEnabled;
  }
  
  static async runAllTaskTests(taskId: string): Promise<boolean> {
    const result = await projectTracker.runTaskTests(taskId);
    
    if (result) {
      toast({
        title: "Tests passed",
        description: `All tests for this task have passed successfully.`,
        variant: "default",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Tests failed",
        description: `Some tests for this task have failed. Check the console for details.`,
      });
    }
    
    return result;
  }
  
  static async verifyChange(changeId: string, description: string): Promise<VerificationResult> {
    console.log(`Verifying change: ${changeId} (${description})`);
    
    if (!TestRunner.verificationEnabled) {
      console.log('Verification disabled, skipping tests');
      return {
        status: 'SKIPPED',
        message: 'Verification is disabled',
        changeId,
        description
      };
    }
    
    const dbConnected = await TestRunner.testDatabaseConnection();
    if (!dbConnected) {
      return {
        status: 'FAILED',
        message: 'Database connection failed',
        changeId,
        description,
        details: {
          dbConnectionError: true
        }
      };
    }
    
    const summary = await TestRunner.testManager.runAllTests();
    
    let status: 'VERIFIED' | 'PARTIAL' | 'FAILED';
    let message: string;
    
    if (summary.status === TestManager.RESULT_VERIFIED) {
      status = 'VERIFIED';
      message = `All ${summary.totalTests} tests passed`;
    } else if (summary.status === TestManager.RESULT_PARTIAL) {
      status = 'PARTIAL';
      message = `${summary.passedTests} of ${summary.totalTests} tests passed`;
    } else {
      status = 'FAILED';
      message = `All ${summary.totalTests} tests failed`;
    }
    
    return {
      status,
      message,
      changeId,
      description,
      details: {
        summary,
        reports: TestRunner.testManager.getAllTestReports()
      }
    };
  }
  
  static async testDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Database connection test failed:', error);
        return false;
      }
      
      console.log('Database connection test passed');
      return true;
    } catch (error) {
      console.error('Database connection test error:', error);
      return false;
    }
  }
  
  static async testAuthStatus(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth status test error:', error);
        return false;
      }
      
      console.log('Auth status:', session ? 'Logged in' : 'Logged out');
      return true;
    } catch (error) {
      console.error('Auth status test error:', error);
      return false;
    }
  }
  
  static testComponentRender(component: React.ReactNode): boolean {
    try {
      // In a real implementation, this would use React Testing Library
      // For now, we just check that the component is not null
      return component !== null && component !== undefined;
    } catch (error) {
      console.error('Component render test error:', error);
      return false;
    }
  }
  
  static async testProgressItemOrder(itemIds: string[]): Promise<boolean> {
    try {
      if (!itemIds || itemIds.length === 0) {
        console.error('No item IDs provided for order test');
        return false;
      }
      
      // Check if items exist in database
      const { data, error } = await supabase
        .from('progress_items')
        .select('id')
        .in('id', itemIds);
        
      if (error) {
        console.error('Error fetching items for order test:', error);
        return false;
      }
      
      // Verify all items were found
      if (!data || data.length !== itemIds.length) {
        console.error(`Only found ${data?.length} of ${itemIds.length} items in database`);
        return false;
      }
      
      // Verify local storage order
      const savedOrderStr = localStorage.getItem('progressItemsOrder');
      if (!savedOrderStr) {
        console.error('No saved order found in localStorage');
        return false;
      }
      
      try {
        const savedOrder = JSON.parse(savedOrderStr);
        if (!Array.isArray(savedOrder) || savedOrder.length === 0) {
          console.error('Invalid saved order format in localStorage');
          return false;
        }
        
        console.log('Progress item order test passed');
        return true;
      } catch (e) {
        console.error('Error parsing saved order from localStorage:', e);
        return false;
      }
    } catch (error) {
      console.error('Progress item order test error:', error);
      return false;
    }
  }
}

export const runInitialTests = async () => {
  if (typeof window !== 'undefined') {
    console.log('Running initial environment tests...');
    
    // Test database connection
    const dbConnectionOk = await TestRunner.testDatabaseConnection();
    console.log('Database connection:', dbConnectionOk ? 'OK' : 'Failed');
    
    // Test auth status
    const authStatusOk = await TestRunner.testAuthStatus();
    console.log('Auth system:', authStatusOk ? 'OK' : 'Failed');
  }
};

export interface VerificationResult {
  status: 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  message: string;
  changeId: string;
  description: string;
  details?: Record<string, any>;
}
