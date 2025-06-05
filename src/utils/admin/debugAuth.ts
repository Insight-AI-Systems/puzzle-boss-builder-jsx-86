
import { supabase } from '@/integrations/supabase/client';

export const debugAuthState = async () => {
  console.log('=== DEBUG AUTH STATE ===');
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current session:', session);
    console.log('Session error:', sessionError);
    
    if (session?.user) {
      console.log('User email:', session.user.email);
      console.log('User ID:', session.user.id);
      
      // Check profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      console.log('Profile data:', profile);
      console.log('Profile error:', profileError);
    }
  } catch (error) {
    console.error('Debug auth error:', error);
  }
  
  console.log('=== END DEBUG ===');
};

export const forceProtectedAdminAccess = () => {
  console.log('Force admin access requested');
  // This is just for debugging - in real implementation, 
  // the access should be properly managed through the database
  console.log('Please ensure user alantbooth@xtra.co.nz has super_admin role in the database');
};
