
export const appRecovery = {
  clearStorage: function() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      return 'Storage cleared';
    } catch (e) {
      return 'Error clearing storage: ' + e.message;
    }
  },
  
  reloadPage: function() {
    window.location.reload();
  },
  
  switchMode: function(mode) {
    try {
      localStorage.setItem('app-last-mode', mode);
      const url = new URL(window.location);
      url.searchParams.set('mode', mode);
      window.location = url.toString();
    } catch (e) {
      console.error('[STARTUP] Error switching mode:', e);
      return 'Error switching mode: ' + e.message;
    }
  }
};

// Initialize recovery utilities
export const initializeRecoveryUtils = () => {
  window.appRecovery = appRecovery;
};
