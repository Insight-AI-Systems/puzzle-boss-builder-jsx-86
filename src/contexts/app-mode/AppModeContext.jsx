
import { createContext } from 'react';
import { getDefaultSettings } from './utils';

/**
 * AppMode context for managing application mode and diagnostic settings
 * @type {React.Context<import('./types').AppModeContextValue>}
 */
export const AppModeContext = createContext({
  isMinimal: false,
  toggleMode: () => {},
  modeTransition: { active: false, target: null, startTime: null },
  diagnosticSettings: getDefaultSettings(),
  updateDiagnosticSettings: () => {},
  dismissWarning: () => {},
  isWarningDismissed: () => false
});

export default AppModeContext;
