
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets a user's role to admin or super_admin in the database
 * This can be called from the browser console to quickly assign admin roles
 */
export async function setUserAsAdmin(email: string, role: 'admin' | 'super_admin' = 'admin') {
  try {
    console.log(`Attempting to set user ${email} as ${role}...`);
    
    const { data, error } = await supabase.functions.invoke('set-admin-role', {
      body: { email, role }
    });
    
    if (error) {
      console.error('Error setting admin role:', error);
      return { success: false, error };
    }
    
    console.log(`Successfully set ${email} as ${role}`, data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception in setUserAsAdmin:', err);
    return { success: false, error: err };
  }
}

// Make the function available in the global window object for console access
if (typeof window !== 'undefined') {
  (window as any).setUserAsAdmin = setUserAsAdmin;
}
