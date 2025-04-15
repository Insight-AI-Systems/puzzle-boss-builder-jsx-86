
/**
 * Checks if the application is running in standalone mode
 * @returns {boolean} True if the app is in standalone mode
 */
export function isStandaloneMode() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('standalone') === 'true';
  } catch (error) {
    console.error('Error checking standalone mode:', error);
    return false;
  }
}

/**
 * Enables standalone mode by adding the URL parameter
 */
export function enableStandaloneMode() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('standalone', 'true');
    window.location.href = url.toString();
  } catch (error) {
    console.error('Error enabling standalone mode:', error);
  }
}

/**
 * Disables standalone mode by removing the URL parameter
 */
export function disableStandaloneMode() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('standalone');
    window.location.href = url.toString();
  } catch (error) {
    console.error('Error disabling standalone mode:', error);
  }
}
