
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add error boundary for better debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
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

// Create root and render app
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
