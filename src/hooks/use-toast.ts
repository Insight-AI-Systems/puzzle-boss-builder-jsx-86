
import { useToast as useToastOriginal, toast as toastOriginal } from "@/components/ui/use-toast";

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

// Set default toast duration
const DEFAULT_DURATION = 5000;

/**
 * Enhanced toast function with standardized variants and defaults
 */
export function toast(options: ToastOptions) {
  return toastOriginal({
    ...options,
    duration: options.duration || DEFAULT_DURATION,
  });
}

/**
 * Success toast
 */
toast.success = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: 'success',
  });
};

/**
 * Error toast
 */
toast.error = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: 'destructive',
  });
};

/**
 * Warning toast
 */
toast.warning = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: 'warning',
  });
};

/**
 * Info toast
 */
toast.info = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: 'info',
  });
};

/**
 * Enhanced useToast hook with our customizations
 */
export function useToast() {
  return {
    ...useToastOriginal(),
    toast,
  };
}
