
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Add additional debugging info when possible
  if (event.error && event.error.stack) {
    console.error('Error stack:', event.error.stack);
  }
  
  // Display error to the user in development
  if (process.env.NODE_ENV === 'development') {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.right = '0';
    errorDiv.style.padding = '10px';
    errorDiv.style.background = '#ff5555';
    errorDiv.style.color = 'white';
    errorDiv.style.zIndex = '9999';
    errorDiv.textContent = `Error: ${event.error?.message || 'Unknown error'}`;
    document.body.appendChild(errorDiv);
    
    // Remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 10000);
  }
});

// Enable React debugging in development
if (process.env.NODE_ENV === 'development') {
  console.log('React development mode enabled');
}

// Create a container for the React application
const container = document.getElementById("root");

// Ensure container exists before creating root
if (!container) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML");
}

// Custom error boundary for the entire app
interface ErrorFallbackProps {
  children: React.ReactNode;
}

class ErrorFallback extends React.Component<ErrorFallbackProps, { hasError: boolean, error: Error | null }> {
  constructor(props: ErrorFallbackProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed with error:', error);
    console.error('Component stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <p className="mb-4">The application encountered an unexpected error:</p>
            <pre className="bg-gray-800 p-4 rounded overflow-x-auto mb-4">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create root and render app with error boundary
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorFallback>
      <App />
    </ErrorFallback>
  </React.StrictMode>
);
