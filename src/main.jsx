
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';
import './index.css';

// Enhanced initialization logging
console.log('Main.jsx initialization started at:', new Date().toISOString());
console.log('Environment info:', {
  userAgent: navigator.userAgent,
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight
  }
});

// Try/catch block to catch initialization errors
try {
  console.log('Searching for root element...');
  const rootElement = document.getElementById('root');

  if (rootElement) {
    console.log('Root element found, mounting app...');
    
    // Check if anything is already rendered in the root
    console.log('Root element current content:', rootElement.innerHTML);
    
    // Clear any loading indicators that might be in the root
    if (rootElement.innerHTML.includes('Loading The Puzzle Boss')) {
      console.log('Clearing loading message...');
    }
    
    // Create and render the app
    const root = createRoot(rootElement);
    console.log('Root created, rendering app...');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('App rendered successfully');
  } else {
    console.error('Failed to find root element in DOM');
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #000000; color: #FF0000; font-family: sans-serif;">
        <div style="text-align: center;">
          <h1>Error Loading The Puzzle Boss</h1>
          <p>Could not find the root element. Please check the console for details.</p>
        </div>
      </div>
    `;
  }
} catch (error) {
  console.error('Critical error during app initialization:', error);
  // Try to display an error message on the page
  try {
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #000000; color: #FF0000; font-family: sans-serif;">
        <div style="text-align: center;">
          <h1>Error Loading The Puzzle Boss</h1>
          <p>${error.message || 'Unknown error'}</p>
          <p>Check the console for more details.</p>
        </div>
      </div>
    `;
  } catch (displayError) {
    console.error('Failed to display error message:', displayError);
  }
}
