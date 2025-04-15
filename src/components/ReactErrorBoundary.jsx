
import React from 'react';

/**
 * A simplified error boundary component specifically for the minimal app
 * to catch and display React errors
 */
class ReactErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null
    };
    console.log('[DEBUG] ReactErrorBoundary initialized');
  }

  static getDerivedStateFromError(error) {
    console.error('[DEBUG] Error caught by ReactErrorBoundary:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[DEBUG] Component stack trace:', errorInfo.componentStack);
    
    if (window.__addDiagnosticLog) {
      window.__addDiagnosticLog(`ERROR: ${error.message}`);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-puzzle-burgundy/30 rounded-lg border border-puzzle-burgundy">
          <h3 className="text-xl text-puzzle-burgundy font-bold mb-2">React Error</h3>
          <p className="mb-4 text-white">
            {this.state.error && this.state.error.toString()}
          </p>
          
          <details className="mb-4">
            <summary className="cursor-pointer text-puzzle-aqua">View component stack trace</summary>
            <pre className="mt-2 p-2 bg-black/50 rounded text-xs text-gray-400 overflow-auto max-h-[200px]">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="px-4 py-2 bg-puzzle-aqua text-black rounded hover:bg-puzzle-aqua/80"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ReactErrorBoundary;
