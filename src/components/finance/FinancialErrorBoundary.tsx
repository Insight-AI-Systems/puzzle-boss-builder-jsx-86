
import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

class FinancialErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FINANCIAL ERROR BOUNDARY] Component error caught:', error);
    console.error('[FINANCIAL ERROR BOUNDARY] Component stack:', errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState(state => ({
      hasError: false,
      error: null,
      retryCount: state.retryCount + 1
    }));
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-medium text-red-800">Something went wrong loading financial data</h3>
          <p className="mt-2 text-sm text-red-700">
            {this.state.error?.message || 'An unknown error occurred'}
          </p>
          <div className="mt-4">
            <Button 
              onClick={this.handleRetry}
              variant="outline"
              className="bg-white hover:bg-red-50 border-red-300 text-red-700"
            >
              Try Again
            </Button>
          </div>
          {this.state.retryCount >= 3 && (
            <p className="mt-4 text-sm text-red-600">
              Still having issues? Please refresh the page or contact support.
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default FinancialErrorBoundary;
