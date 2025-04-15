
export { AppModeContext } from './AppModeContext';
export { AppModeProvider } from './AppModeProvider';
export { useAppMode } from './useAppMode';
export { isStandaloneMode, enableStandaloneMode, disableStandaloneMode } from './standaloneMode';

/**
 * Higher-order component for wrapping components that need app mode
 * @param {React.ComponentType} Component - Component to wrap
 * @returns {React.ComponentType} Wrapped component with app mode props
 */
export function withAppMode(Component) {
  return function WrappedComponent(props) {
    const { useAppMode } = require('./useAppMode');
    const appMode = useAppMode();
    return <Component {...props} appMode={appMode} />;
  };
}

/**
 * Standalone function to check the current mode without using hooks
 * @returns {boolean} True if the app is in minimal mode
 */
export function getAppMode() {
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
    console.error('Error checking app mode:', error);
    return false;
  }
}
