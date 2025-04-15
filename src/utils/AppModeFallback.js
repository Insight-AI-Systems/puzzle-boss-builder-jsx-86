
/**
 * AppModeFallback utility
 * 
 * Provides standalone functions to check and control app mode
 * without relying on React contexts
 */

// Check if the app is in minimal mode
export function isMinimalMode() {
  try {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('minimal')) {
      return urlParams.get('minimal') === 'true';
    }
    // Then check localStorage
    const stored = localStorage.getItem('app-mode');
    return stored ? stored === 'minimal' : false;
  } catch (error) {
    console.error('Error checking minimal mode:', error);
    return false;
  }
}

// Switch to minimal mode
export function enableMinimalMode() {
  try {
    localStorage.setItem('app-mode', 'minimal');
    
    // Also set URL parameter for immediate effect
    const url = new URL(window.location.href);
    url.searchParams.set('minimal', 'true');
    window.location.href = url.toString();
  } catch (error) {
    console.error('Failed to enable minimal mode:', error);
    
    // Fallback: try just changing URL
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('minimal', 'true');
      window.location.href = url.toString();
    } catch (fallbackError) {
      console.error('Critical failure enabling minimal mode:', fallbackError);
      alert('Failed to switch to minimal mode. Try adding ?minimal=true to the URL manually.');
    }
  }
}

// Switch to full mode
export function enableFullMode() {
  try {
    localStorage.setItem('app-mode', 'full');
    
    // Remove URL parameter if it exists
    const url = new URL(window.location.href);
    url.searchParams.delete('minimal');
    window.location.href = url.toString();
  } catch (error) {
    console.error('Failed to enable full mode:', error);
    
    // Fallback: try just changing URL
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('minimal');
      window.location.href = url.toString();
    } catch (fallbackError) {
      console.error('Critical failure enabling full mode:', fallbackError);
      alert('Failed to switch to full mode. Try removing ?minimal=true from the URL manually.');
    }
  }
}

// Switch to standalone mode
export function enableStandaloneMode() {
  try {
    // Set URL parameter for standalone mode
    const url = new URL(window.location.href);
    url.searchParams.set('standalone', 'true');
    window.location.href = url.toString();
  } catch (error) {
    console.error('Failed to enable standalone mode:', error);
    alert('Failed to switch to standalone mode. Try adding ?standalone=true to the URL manually.');
  }
}

// Toggle between minimal and full mode
export function toggleAppMode() {
  if (isMinimalMode()) {
    enableFullMode();
  } else {
    enableMinimalMode();
  }
}

// Create a global utility for emergency fallback
window.__toggleAppMode = toggleAppMode;
window.__enableMinimalMode = enableMinimalMode;
window.__enableFullMode = enableFullMode;
window.__enableStandaloneMode = enableStandaloneMode;
