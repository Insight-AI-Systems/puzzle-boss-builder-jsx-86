
import { supabase } from '@/integrations/supabase/client';
import { adminLog, DebugLevel } from '@/utils/debug';

export const debugAuthState = async () => {
  adminLog('DebugAuth', 'Starting auth state debug...', DebugLevel.INFO);
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    adminLog('DebugAuth', 'Current session', DebugLevel.INFO, session);
    
    if (sessionError) {
      adminLog('DebugAuth', 'Session error', DebugLevel.ERROR, sessionError);
    }
    
    if (session?.user) {
      adminLog('DebugAuth', `User email: ${session.user.email}`, DebugLevel.INFO);
      adminLog('DebugAuth', `User ID: ${session.user.id}`, DebugLevel.INFO);
      
      // Check profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      adminLog('DebugAuth', 'Profile data', DebugLevel.INFO, profile);
      
      if (profileError) {
        adminLog('DebugAuth', 'Profile error', DebugLevel.ERROR, profileError);
      }
    }
  } catch (error) {
    adminLog('DebugAuth', 'Debug auth error', DebugLevel.ERROR, error);
  }
  
  adminLog('DebugAuth', 'Auth state debug complete', DebugLevel.INFO);
};

export const forceProtectedAdminAccess = () => {
  adminLog('DebugAuth', 'Force admin access requested', DebugLevel.WARN);
  // This is just for debugging - in real implementation, 
  // the access should be properly managed through the database
  adminLog('DebugAuth', 'Please ensure user alantbooth@xtra.co.nz has super_admin role in the database', DebugLevel.INFO);
};
