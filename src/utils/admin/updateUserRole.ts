
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a user's role in the database (admin only function)
 */
export async function updateUserRoleInDatabase(email: string, newRole: string, adminEmail: string) {
  try {
    console.log(`Admin ${adminEmail} updating role for ${email} to ${newRole}`);
    
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { 
        email, 
        role: newRole,
        adminEmail 
      }
    });
    
    if (error) {
      console.error('Error updating user role:', error);
      throw new Error(`Failed to update role: ${error.message}`);
    }
    
    console.log(`Successfully updated ${email} to role ${newRole}`);
    return { success: true, data };
  } catch (err) {
    console.error('Exception updating user role:', err);
    throw err;
  }
}

/**
 * Emergency function to ensure alan@insight-ai-systems.com has super_admin role
 * This should only be called once during setup
 */
export async function ensureAlanHasSuperAdminRole() {
  try {
    console.log('Ensuring alan@insight-ai-systems.com has super_admin role...');
    
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { 
        email: 'alan@insight-ai-systems.com', 
        role: 'super_admin',
        adminEmail: 'alan@insight-ai-systems.com' // Self-bootstrap
      }
    });
    
    if (error) {
      console.error('Error setting Alan as super_admin:', error);
      return { success: false, error };
    }
    
    console.log('Successfully ensured Alan has super_admin role');
    return { success: true, data };
  } catch (err) {
    console.error('Exception ensuring Alan has super_admin role:', err);
    return { success: false, error: err };
  }
}

/**
 * Function to remove admin access from alantbooth@xtra.co.nz
 */
export async function removeAlanBoothAdminAccess() {
  try {
    console.log('Removing admin access from alantbooth@xtra.co.nz...');
    
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { 
        email: 'alantbooth@xtra.co.nz', 
        role: 'player',
        adminEmail: 'alan@insight-ai-systems.com'
      }
    });
    
    if (error) {
      console.error('Error removing admin access from alantbooth@xtra.co.nz:', error);
      return { success: false, error };
    }
    
    console.log('Successfully removed admin access from alantbooth@xtra.co.nz');
    return { success: true, data };
  } catch (err) {
    console.error('Exception removing admin access:', err);
    return { success: false, error: err };
  }
}

// Make functions available globally for console debugging (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).updateUserRoleInDatabase = updateUserRoleInDatabase;
  (window as any).ensureAlanHasSuperAdminRole = ensureAlanHasSuperAdminRole;
  (window as any).removeAlanBoothAdminAccess = removeAlanBoothAdminAccess;
}
