
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

  // Store toast function in a ref for global access
  const toastFnRef = React.useRef(toast);
  React.useEffect(() => {
    // Update the ref whenever toast function changes
    toastFnRef.current = toast;
    
    // Set a global reference for standalone usage
    if (typeof window !== "undefined") {
      window.__TOAST_FN = toast;
    }
    
    return () => {
      // Clean up global reference when component unmounts
      if (typeof window !== "undefined") {
        window.__TOAST_FN = undefined;
      }
    };
  }, [toast]);

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

// Create a standalone toast function that can be used without the hook
// This version avoids recursive calls by not using the hook itself
const toast = (props) => {
  // For standalone usage without context, log to console as fallback
  if (typeof props === 'string') {
    props = { description: props };
  }
  
  // If we're in a browser context, try to access the context via a global
  if (typeof window !== "undefined" && window.__TOAST_FN) {
    try {
      return window.__TOAST_FN(props);
    } catch (e) {
      console.error("Failed to access toast function:", e);
      console.log("Toast fallback:", props.title || props.description || props);
    }
  } else {
    // Fall back to console if no global toast function is available
    console.log("Toast fallback:", props.title || props.description || props);
  }
  
  return null;
};

export { useToast, toast, ToastProvider };
