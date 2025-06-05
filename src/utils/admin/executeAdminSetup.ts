
import { setUserAsSuperAdmin } from './setUserRole';

/**
 * Sets up alantbooth@xtra.co.nz as super admin
 */
export async function setupAlanAsAdmin() {
  const email = 'alantbooth@xtra.co.nz';
  console.log('Setting up Alan as super admin...');
  
  const result = await setUserAsSuperAdmin(email);
  
  if (result.success) {
    console.log('Alan has been successfully set as super admin!');
  } else {
    console.error('Failed to set Alan as super admin:', result.error);
  }
  
  return result;
}

// Auto-execute when this module is imported
setupAlanAsAdmin();

// Make function available globally
if (typeof window !== 'undefined') {
  (window as any).setupAlanAsAdmin = setupAlanAsAdmin;
}
