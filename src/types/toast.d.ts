
// Add to existing types or create if doesn't exist
import { ReactNode } from "react";

export type ToastVariant = "default" | "destructive" | "warning";

export interface ToastProps {
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  duration?: number;
  id?: string | number;
  onClose?: () => void;
}
