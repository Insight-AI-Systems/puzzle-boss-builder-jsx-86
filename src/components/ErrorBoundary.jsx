
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      componentTrace: [],
      attemptedRecovery: false
    };
    console.log('[ERROR_BOUNDARY] Initializing');
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    console.error('[ERROR_BOUNDARY] Error caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Enhanced error logging
    console.error('[ERROR_BOUNDARY] Component stack trace:', errorInfo.componentStack);
    
    // Extract component names from stack trace for better debugging
    const componentStack = errorInfo.componentStack || '';
    const componentNames = componentStack
      .split('\n')
      .filter(line => line.trim().startsWith('at'))
      .map(line => {
        const match = line.match(/at (\w+)/);
        return match ? match[1] : 'Unknown';
      });
    
    this.setState({ 
      errorInfo,
      componentTrace: componentNames
    });
    
    // Log additional diagnostic info
    console.log('[ERROR_BOUNDARY] Error caught in these components:', componentNames);
  }

  componentDidUpdate(prevProps, prevState) {
    // Try to recover from error on props change
    if (this.state.hasError && JSON.stringify(prevProps) !== JSON.stringify(this.props) && !this.state.attemptedRecovery) {
      console.log('[ERROR_BOUNDARY] Props changed, attempting recovery');
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        componentTrace: [],
        attemptedRecovery: true 
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use provided fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default enhanced error display
      return (
        <div className="p-8 bg-red-900/20 rounded-lg border border-red-500">
          <h2 className="text-xl text-red-500 font-bold mb-4">Component Error</h2>
          <p className="text-white mb-4">
            {this.state.error && this.state.error.toString()}
          </p>
          
          {this.state.componentTrace.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md text-red-300 mb-2">Error occurred in:</h3>
              <ul className="list-disc pl-5 text-gray-300">
                {this.state.componentTrace.map((component, index) => (
                  <li key={index}>{component}</li>
                ))}
              </ul>
            </div>
          )}
          
          <details className="text-white whitespace-pre-wrap p-4 bg-black/50 rounded-md">
            <summary className="cursor-pointer text-puzzle-aqua">View component stack trace</summary>
            <pre className="mt-2 text-sm text-gray-400 overflow-auto max-h-[200px]">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          
          <button
            onClick={() => {
              this.setState({ 
                hasError: false, 
                error: null, 
                errorInfo: null,
                componentTrace: [],
                attemptedRecovery: false
              });
            }}
            className="mt-4 px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80 mr-2"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
