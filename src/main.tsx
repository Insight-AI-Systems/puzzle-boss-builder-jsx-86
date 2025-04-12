
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add console log to confirm the file is running
console.log("Main.tsx is executing");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log("App has been rendered to the DOM");
}
