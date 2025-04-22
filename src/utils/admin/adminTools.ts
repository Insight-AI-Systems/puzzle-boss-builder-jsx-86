import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets a user's role to super_admin in the database
 * This can be called from the browser console to quickly assign admin roles
 * @param email The email address of the user to set as admin
 * @returns A promise that resolves to an object with success status and data
 */
export async function setUserAsAdmin(email: string) {
  try {
    console.log(`Attempting to set user ${email} as super_admin...`);
    
    // Display a toast notification to show the operation is in progress
    toast.loading(`Setting ${email} as super_admin...`);
    
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { email, role: 'super_admin' }
    });
    
    if (error) {
      console.error('Error setting admin role:', error);
      toast.error(`Failed to set ${email} as super_admin. Error: ${error.message}`);
      return { success: false, error };
    }
    
    console.log(`Successfully set ${email} as super_admin`, data);
    toast.success(`Successfully set ${email} as super_admin`);
    
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

/**
 * Sets Rob Small as an admin user
 */
export async function makeRobAdmin() {
  const email = 'rob.small.1234@gmail.com';
  console.log('Setting Rob as admin...');
  const result = await setUserAsAdmin(email);
  console.log('Result:', result);
  return result;
}

// Make the functions available in the global window object for console access
if (typeof window !== 'undefined') {
  (window as any).setUserAsAdmin = setUserAsAdmin;
  (window as any).getCurrentUserRole = getCurrentUserRole;
  (window as any).listAdminUsers = listAdminUsers;
  (window as any).makeRobAdmin = makeRobAdmin;
}
