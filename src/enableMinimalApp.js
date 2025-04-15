
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
    localStorage.setItem('use_minimal_app', 'true');
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
