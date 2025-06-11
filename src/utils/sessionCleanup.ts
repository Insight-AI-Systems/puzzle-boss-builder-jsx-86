
import { sessionTracker } from './sessionTracker';

// Track the current user's email for cleanup
let currentUserEmail: string | null = null;

export const setCurrentUserForCleanup = (email: string | null) => {
  currentUserEmail = email;
};

// Set up cleanup listeners
export const initializeSessionCleanup = () => {
  // Handle browser close/refresh
  const handleBeforeUnload = () => {
    if (currentUserEmail) {
      sessionTracker.endSession(currentUserEmail);
    }
  };

  // Handle page visibility change (user switches tabs/minimizes)
  const handleVisibilityChange = () => {
    if (document.hidden && currentUserEmail) {
      // Don't end session on tab switch, just log it
      console.log('🔄 User switched away from tab');
    } else if (!document.hidden && currentUserEmail) {
      console.log('🔄 User returned to tab');
    }
  };

  // Add event listeners
  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};
