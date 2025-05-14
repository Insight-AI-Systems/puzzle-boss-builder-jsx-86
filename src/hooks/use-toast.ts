
import { useState, useEffect, useCallback } from "react";
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = React.ComponentPropsWithoutRef<typeof sonnerToast>;

export type ToastActionElement = React.ReactElement<{
  altText: string;
}>;

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariant;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  important?: boolean;
  onDismiss?: () => void;
  onAutoClose?: () => void;
  closeButton?: boolean;
  id?: string;
}

const defaultToastOptions: Partial<ToastOptions> = {
  duration: 5000,
  position: 'bottom-right',
  closeButton: true,
};

function getVariantStyle(variant: ToastVariant = 'default'): any {
  const variantStyles = {
    default: {
      className: 'bg-background border',
    },
    destructive: {
      className: 'bg-destructive text-destructive-foreground border-destructive',
    },
    success: {
      className: 'bg-green-500 text-white border-green-600',
    },
    warning: {
      className: 'bg-amber-500 text-white border-amber-600',
    },
    info: {
      className: 'bg-blue-500 text-white border-blue-600',
    },
  };

  return variantStyles[variant] || variantStyles.default;
}

export function toast(options: ToastOptions) {
  const { title, description, variant, action, ...restOptions } = {
    ...defaultToastOptions,
    ...options,
  };

  const variantStyle = getVariantStyle(variant);

  return sonnerToast(title, {
    description,
    action,
    ...variantStyle,
    ...restOptions,
  });
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastT[]>([]);

  const dismissToast = useCallback((toastId?: string) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
    }
  }, []);

  const updateToast = useCallback((toastId: string, options: ToastOptions) => {
    const { title, description, variant, action, ...restOptions } = {
      ...defaultToastOptions,
      ...options,
    };

    const variantStyle = getVariantStyle(variant);

    sonnerToast.update(toastId, {
      ...variantStyle,
      ...restOptions,
      description,
      action,
    });
  }, []);

  return {
    toast,
    dismissToast,
    updateToast,
    toasts,
  };
}
