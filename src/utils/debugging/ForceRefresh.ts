/**
 * FORCE COMPLETE CACHE REFRESH
 * This will help clear any cached old puzzle components
 */

// Clear all localStorage data that might be caching old puzzle components
if (typeof window !== 'undefined') {
  // Clear any puzzle-related localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.includes('puzzle') || key.includes('jigsaw')) {
      localStorage.removeItem(key);
      console.log('🧹 Cleared localStorage:', key);
    }
  });
  
  // Clear any puzzle-related sessionStorage  
  Object.keys(sessionStorage).forEach(key => {
    if (key.includes('puzzle') || key.includes('jigsaw')) {
      sessionStorage.removeItem(key);
      console.log('🧹 Cleared sessionStorage:', key);
    }
  });
  
  // Force component refresh
  console.log('🔄 FORCING COMPLETE PUZZLE CACHE REFRESH');
  console.log('⚠️ If you still see old puzzle code, please hard refresh your browser (Ctrl+Shift+R)');
}