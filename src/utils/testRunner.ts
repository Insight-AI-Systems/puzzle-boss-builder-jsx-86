
/**
 * Test Runner - Utilities for running tests and verifying functionality
 */

import { projectTracker } from './projectTracker';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export class TestRunner {
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
        title: "Tests failed",
        description: `Some tests for this task have failed. Check the console for details.`,
        variant: "destructive",
      });
    }
    
    return result;
  }
  
  // Database connection test
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
  
  // Auth test helpers
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
  
  // Component rendering test helper
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
}

// Modified to avoid using hooks outside of component functions
// This function should be called from a component, not at the module level
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
