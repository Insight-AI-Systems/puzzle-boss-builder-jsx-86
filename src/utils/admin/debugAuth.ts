
import { debugLog, DebugLevel } from '@/utils/debug';
import { PROTECTED_ADMIN_EMAIL } from '@/config/securityConfig';

/**
 * Debug the current auth state
 * This will log detailed auth information to help debug issues
 */
export function debugAuthState() {
  try {
    // Get auth data from local storage
    const sbAuth = localStorage.getItem('sb-auth');
    
    if (!sbAuth) {
      console.log('No Supabase auth data found in local storage');
      return;
    }
    
    const authData = JSON.parse(sbAuth);
    
    // Safe extraction of data
    const user = authData?.user;
    const session = authData?.session;
    const email = user?.email;
    
    const isProtectedAdmin = email?.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
    
    // Log detailed auth info
    debugLog('AuthDebug', 'Current auth state', DebugLevel.INFO, {
      hasUser: !!user,
      hasSession: !!session,
      email,
      isProtectedAdmin,
      userId: user?.id,
      sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
      sessionValid: session?.expires_at ? (session.expires_at * 1000) > Date.now() : false
    });
    
    console.log('Auth Debug:', {
      user,
      session,
      isProtectedAdmin
    });
    
    // Check for and display any role data
    const roleData = localStorage.getItem('user-roles');
    if (roleData) {
      try {
        const roles = JSON.parse(roleData);
        console.log('Stored Roles:', roles);
      } catch {
        console.log('Failed to parse stored roles data');
      }
    } else {
      console.log('No stored roles data found');
    }
    
    return { user, session, isProtectedAdmin };
    
  } catch (error) {
    console.error('Error debugging auth state:', error);
    return null;
  }
}

/**
 * Force protected admin access for testing
 * This will update the current user's email in local storage to match the protected admin
 * WARNING: This is for development/testing only!
 */
export function forceProtectedAdminAccess(): boolean {
  try {
    // Get auth data
    const sbAuth = localStorage.getItem('sb-auth');
    
    if (!sbAuth) {
      console.log('No Supabase auth data found in local storage');
      return false;
    }
    
    const authData = JSON.parse(sbAuth);
    
    // Check if user exists
    if (!authData?.user) {
      console.log('No user found in auth data');
      return false;
    }
    
    // Check if already protected admin
    if (authData.user.email === PROTECTED_ADMIN_EMAIL) {
      console.log('Already set as protected admin');
      return true;
    }
    
    // Store original email for reference
    const originalEmail = authData.user.email;
    
    // Update the email to protected admin email
    authData.user.email = PROTECTED_ADMIN_EMAIL;
    
    // Save back to local storage
    localStorage.setItem('sb-auth', JSON.stringify(authData));
    
    console.log(`Temporarily changed user email from ${originalEmail} to ${PROTECTED_ADMIN_EMAIL}`);
    console.log('Page refresh required for changes to take effect');
    
    return true;
    
  } catch (error) {
    console.error('Error forcing protected admin access:', error);
    return false;
  }
}
