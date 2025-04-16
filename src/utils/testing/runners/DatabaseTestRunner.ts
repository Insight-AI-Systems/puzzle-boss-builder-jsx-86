
import { supabase } from '@/integrations/supabase/client';

export class DatabaseTestRunner {
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
}
