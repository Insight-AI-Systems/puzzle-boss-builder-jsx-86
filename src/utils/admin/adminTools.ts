
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets a user's role to admin or super_admin in the database
 * This can be called from the browser console to quickly assign admin roles
 * @param email The email address of the user to set as admin
 * @param role The role to assign to the user (admin or super_admin)
 * @returns A promise that resolves to an object with success status and data
 */
export async function setUserAsAdmin(email: string, role: 'admin' | 'super_admin' = 'admin') {
  try {
    console.log(`Attempting to set user ${email} as ${role}...`);
    
    // Display a toast notification to show the operation is in progress
    toast.loading(`Setting ${email} as ${role}...`);
    
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { email, role }
    });
    
    if (error) {
      console.error('Error setting admin role:', error);
      toast.error(`Failed to set ${email} as ${role}. Error: ${error.message}`);
      return { success: false, error };
    }
    
    console.log(`Successfully set ${email} as ${role}`, data);
    toast.success(`Successfully set ${email} as ${role}`);
    
    // Force refresh if we're modifying the current user
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.email === email) {
      console.log('Current user role was changed. Refreshing session...');
      await supabase.auth.refreshSession();
      window.location.reload(); // Reload to apply new permissions
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exception in setUserAsAdmin:', err);
    toast.error(`Error setting user as ${role}: ${err instanceof Error ? err.message : String(err)}`);
    return { success: false, error: err };
  }
}

/**
 * Gets the current user role from the profiles table
 * This can be used to debug role issues
 */
export async function getCurrentUserRole() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return { success: false, error: 'No authenticated user' };
    }
    
    console.log('Current user:', user.email);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error getting user role:', error);
      return { success: false, error };
    }
    
    console.log(`Current user role:`, data.role);
    return { success: true, data: data.role };
  } catch (err) {
    console.error('Exception in getCurrentUserRole:', err);
    return { success: false, error: err };
  }
}

/**
 * Lists all users with admin or super_admin roles
 * This can be called from the browser console to check which users have admin access
 */
export async function listAdminUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role')
      .in('role', ['admin', 'super_admin']);
    
    if (error) {
      console.error('Error listing admin users:', error);
      return { success: false, error };
    }
    
    console.log('Admin users:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception in listAdminUsers:', err);
    return { success: false, error: err };
  }
}

// Make the functions available in the global window object for console access
if (typeof window !== 'undefined') {
  (window as any).setUserAsAdmin = setUserAsAdmin;
  (window as any).getCurrentUserRole = getCurrentUserRole;
  (window as any).listAdminUsers = listAdminUsers;
}
