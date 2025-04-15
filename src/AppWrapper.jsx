
import React, { Suspense } from 'react';
import Debug from './components/Debug';
import Loading from './components/ui/loading';
import ErrorBoundary from './components/ErrorBoundary';
import BootstrapLoader from './components/bootstrap/BootstrapLoader';
import useAppInitialization from './hooks/useAppInitialization';
import AppErrorBoundary from './components/app/AppErrorBoundary';
import AppLoadingStatus from './components/app/AppLoadingStatus';

const AppWrapper = ({ children }) => {
  const {
    error,
    setError,
    isLoading,
    appMessage,
    appState,
    setAppState,
    initLogs,
    loadingStages,
    logInit,
    updateStage
  } = useAppInitialization();

  // If there's an error, show our enhanced error UI
  if (error) {
    return (
      <AppErrorBoundary
        error={error}
        appMessage={appMessage}
        appState={appState}
        loadingStages={loadingStages}
        initLogs={initLogs}
      />
    );
  }

  // Show enhanced loading state
  if (isLoading) {
    return (
      <AppLoadingStatus
        appMessage={appMessage}
        appState={appState}
        loadingStages={loadingStages}
        initLogs={initLogs}
      />
    );
  }

  // Render the application with enhanced error boundaries
  try {
    logInit('Rendering AppWrapper children');
    return (
      <div className="app-wrapper" data-state={appState}>
        <Debug message="Application render in progress" />
        <BootstrapLoader
          onComplete={() => logInit('Bootstrap complete')}
          timeout={15000}
        >
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
                <Loading size="large" color="aqua" message="Loading application components..." />
              </div>
            }>
              {children}
            </Suspense>
          </ErrorBoundary>
        </BootstrapLoader>
      </div>
    );
  } catch (renderError) {
    logInit(`Error in AppWrapper render: ${renderError.message}`, true);
    setError(renderError);
    setAppState('render-error');
    return null;
  }
};

export default AppWrapper;
