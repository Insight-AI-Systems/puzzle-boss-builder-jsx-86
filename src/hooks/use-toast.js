
// Create a standalone implementation of the toast hook

import * as React from "react";

// Create a context for the toast system
const ToastContext = React.createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

// Define the toast provider component
function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(({ title, description, action, ...props }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, action, ...props };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    return id;
  }, []);

  const dismiss = React.useCallback((toastId) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

// Define the hook for components to use
function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

// Create a standalone toast function that uses a default provider
// This is a convenience method for one-off toasts without the hook
const toast = function(props) {
  // For standalone usage without context, log to console as fallback
  console.log("Toast:", props.title || props.description || props);
  
  // If we're in a browser context, try to access the context via a global
  if (typeof window !== "undefined") {
    try {
      // Check if we have access to the toast context from a provider higher up
      const contextValue = document.querySelector("[data-toast-provider='true']");
      if (contextValue && window.__TOAST_FN) {
        return window.__TOAST_FN(props);
      }
    } catch (e) {
      console.error("Failed to access toast context:", e);
    }
  }
  
  return null;
}

export { useToast, toast, ToastProvider };
