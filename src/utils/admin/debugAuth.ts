
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Emergency function to force a user login check and refresh their session
 * This can be called from the browser console to troubleshoot auth issues
 */
export async function debugAuthState() {
  try {
    console.log('Debugging auth state...');
    
    // First, get the current user 
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return { success: false, error: userError };
    }
    
    if (!userData.user) {
      console.log('No user is currently logged in');
      return { success: false, message: 'No user logged in' };
    }
    
    console.log('Current user:', userData.user);
    console.log('User metadata:', userData.user.user_metadata);
    
    // Get the session details
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return { success: false, error: sessionError };
    }
    
    console.log('Current session:', sessionData.session);
    
    // Get the profile details
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();
    
    if (profileError) {
      console.error('Error getting profile:', profileError);
    } else {
      console.log('Current profile:', profileData);
    }
    
    // Attempt to refresh the session
    console.log('Refreshing session...');
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error('Error refreshing session:', refreshError);
      return { success: false, error: refreshError };
    }
    
    console.log('Refreshed session:', refreshData.session);
    
    // Show results as toast
    toast.success('Auth state debugged - check console for details');
    
    return { 
      success: true, 
      user: userData.user,
      session: refreshData.session,
      profile: profileData
    };
  } catch (err) {
    console.error('Exception in debugAuthState:', err);
    toast.error(`Auth debug error: ${err instanceof Error ? err.message : String(err)}`);
    return { success: false, error: err };
  }
}

/**
 * Force Alan to have super_admin role
 * This is a special function to ensure Alan always has access
 */
export async function forceProtectedAdminAccess() {
  try {
    const protectedEmail = 'alan@insight-ai-systems.com';
    console.log(`Ensuring ${protectedEmail} has super_admin role...`);
    
    toast.loading(`Setting up protected admin access...`);
    
    // Call the set-admin-role function
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { email: protectedEmail, role: 'super_admin' }
    });
    
    if (error) {
      console.error('Error setting admin role:', error);
      toast.error(`Failed to set protected admin access. Error: ${error.message}`);
      return { success: false, error };
    }
    
    console.log(`Successfully set ${protectedEmail} as super_admin`, data);
    toast.success(`Protected admin access configured!`);
    
    // Check if current user is Alan
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.email === protectedEmail) {
      console.log('Current user is the protected admin. Refreshing session...');
      await supabase.auth.refreshSession();
      window.location.reload(); // Reload to apply new permissions
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exception in forceProtectedAdminAccess:', err);
    toast.error(`Error setting up protected admin: ${err instanceof Error ? err.message : String(err)}`);
    return { success: false, error: err };
  }
}

// Make functions available in the global window object for console access
if (typeof window !== 'undefined') {
  (window as any).debugAuthState = debugAuthState;
  (window as any).forceProtectedAdminAccess = forceProtectedAdminAccess;
}

// Re-export the admin tools for convenience
export * from './adminTools';
