
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';
import './index.css';

// Add console logs to track application initialization
console.log('Main.jsx loaded - looking for root element');

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('Root element found, mounting app...');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('Failed to find root element in DOM');
}
