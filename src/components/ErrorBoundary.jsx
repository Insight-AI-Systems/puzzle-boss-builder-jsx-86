
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-8 bg-red-900/20 rounded-lg border border-red-500">
          <h2 className="text-xl text-red-500 font-bold mb-4">Something went wrong</h2>
          <details className="text-white whitespace-pre-wrap p-4 bg-black/50 rounded-md">
            <summary className="cursor-pointer">View error details</summary>
            <pre className="mt-2 text-sm">{this.state.error && this.state.error.toString()}</pre>
            <pre className="mt-2 text-sm">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
