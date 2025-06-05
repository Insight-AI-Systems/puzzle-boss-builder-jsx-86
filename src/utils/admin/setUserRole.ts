
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets a specific user as super_admin
 * @param email The email address of the user to set as super_admin
 * @returns A promise that resolves to an object with success status and data
 */
export async function setUserAsSuperAdmin(email: string) {
  try {
    console.log(`Setting ${email} as super_admin...`);
    
    toast.loading(`Setting ${email} as super_admin...`);
    
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { email, role: 'super_admin' }
    });
    
    if (error) {
      console.error('Error setting super_admin role:', error);
      toast.error(`Failed to set ${email} as super_admin. Error: ${error.message}`);
      return { success: false, error };
    }
    
    console.log(`Successfully set ${email} as super_admin`, data);
    toast.success(`Successfully set ${email} as super_admin`);
    
    // Check if current user is the one being modified
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.email === email) {
      console.log('Current user role was changed. Refreshing session...');
      await supabase.auth.refreshSession();
      toast.success('Admin role granted, reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exception in setUserAsSuperAdmin:', err);
    toast.error(`Error setting user as super_admin: ${err instanceof Error ? err.message : String(err)}`);
    return { success: false, error: err };
  }
}

// Make function available globally for console access
if (typeof window !== 'undefined') {
  (window as any).setUserAsSuperAdmin = setUserAsSuperAdmin;
}
