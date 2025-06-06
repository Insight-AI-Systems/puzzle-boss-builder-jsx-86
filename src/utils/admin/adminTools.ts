
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { adminLog, DebugLevel } from '@/utils/debug';

/**
 * Sets a user's role to super_admin in the database
 * This can be called from the browser console to quickly assign admin roles
 * @param email The email address of the user to set as admin
 * @returns A promise that resolves to an object with success status and data
 */
export async function setUserAsAdmin(email: string) {
  try {
    adminLog('AdminTools', `Attempting to set user ${email} as super_admin...`, DebugLevel.INFO);
    
    // Display a toast notification to show the operation is in progress
    toast.loading(`Setting ${email} as super_admin...`);
    
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { email, role: 'super_admin' }
    });
    
    if (error) {
      adminLog('AdminTools', 'Error setting admin role', DebugLevel.ERROR, error);
      toast.error(`Failed to set ${email} as super_admin. Error: ${error.message}`);
      return { success: false, error };
    }
    
    adminLog('AdminTools', `Successfully set ${email} as super_admin`, DebugLevel.INFO, data);
    toast.success(`Successfully set ${email} as super_admin`);
    
    // Force refresh if we're modifying the current user
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.email === email) {
      adminLog('AdminTools', 'Current user role was changed. Refreshing session...', DebugLevel.INFO);
      await supabase.auth.refreshSession();
      window.location.reload(); // Reload to apply new permissions
    }
    
    return { success: true, data };
  } catch (err) {
    adminLog('AdminTools', 'Exception in setUserAsAdmin', DebugLevel.ERROR, err);
    toast.error(`Error setting user as super_admin: ${err instanceof Error ? err.message : String(err)}`);
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
      adminLog('AdminTools', 'No authenticated user found', DebugLevel.ERROR);
      return { success: false, error: 'No authenticated user' };
    }
    
    adminLog('AdminTools', `Current user: ${user.email}`, DebugLevel.INFO);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error) {
      adminLog('AdminTools', 'Error getting user role', DebugLevel.ERROR, error);
      return { success: false, error };
    }
    
    adminLog('AdminTools', `Current user role: ${data.role}`, DebugLevel.INFO);
    return { success: true, data: data.role };
  } catch (err) {
    adminLog('AdminTools', 'Exception in getCurrentUserRole', DebugLevel.ERROR, err);
    return { success: false, error: err };
  }
}

/**
 * Lists all users with super_admin role
 * This can be called from the browser console to check which users have admin access
 */
export async function listAdminUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('role', 'super_admin');
    
    if (error) {
      adminLog('AdminTools', 'Error listing admin users', DebugLevel.ERROR, error);
      return { success: false, error };
    }
    
    adminLog('AdminTools', 'Admin users', DebugLevel.INFO, data);
    return { success: true, data };
  } catch (err) {
    adminLog('AdminTools', 'Exception in listAdminUsers', DebugLevel.ERROR, err);
    return { success: false, error: err };
  }
}

/**
 * Sets Rob Small as an admin user
 */
export async function makeRobAdmin() {
  const email = 'rob.small.1234@gmail.com';
  adminLog('AdminTools', 'Setting Rob as admin...', DebugLevel.INFO);
  const result = await setUserAsAdmin(email);
  adminLog('AdminTools', 'Result', DebugLevel.INFO, result);
  return result;
}

// Make the functions available in the global window object for console access
if (typeof window !== 'undefined') {
  (window as any).setUserAsAdmin = setUserAsAdmin;
  (window as any).getCurrentUserRole = getCurrentUserRole;
  (window as any).listAdminUsers = listAdminUsers;
  (window as any).makeRobAdmin = makeRobAdmin;
}
