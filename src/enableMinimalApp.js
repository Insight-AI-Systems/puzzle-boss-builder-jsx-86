
/**
 * Script to enable the minimal application mode
 * 
 * This can be executed in the browser console to switch to minimal app mode
 * even if the main application is failing to load.
 */

(function() {
  console.log('Enabling minimal app mode...');
  
  // Set a flag in local storage
  try {
    localStorage.setItem('app-mode', 'minimal');
    console.log('Set localStorage flag for minimal app mode');
  } catch (e) {
    console.error('Failed to set localStorage:', e);
  }
  
  // Add a URL parameter
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('minimal', 'true');
    window.history.replaceState({}, document.title, url.toString());
    console.log('Added minimal=true parameter to URL');
  } catch (e) {
    console.error('Failed to update URL:', e);
  }
  
  // Force reload the page
  console.log('Reloading page to apply minimal app mode...');
  window.location.reload();
})();

// Add standalone mode option
window.enableStandaloneMode = function() {
  console.log('Enabling standalone app mode (without contexts)...');
  
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('standalone', 'true');
    window.location.href = url.toString();
    console.log('Redirecting to standalone mode...');
  } catch (e) {
    console.error('Failed to enable standalone mode:', e);
    alert('Failed to switch to standalone mode. Try adding ?standalone=true to the URL manually.');
  }
};

// Make it globally available for console usage
console.log('Use window.enableStandaloneMode() to switch to standalone mode (no contexts)');
