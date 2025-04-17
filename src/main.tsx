
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
