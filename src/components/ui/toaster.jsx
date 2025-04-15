
import { useToast, ToastProvider } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as ToastUIProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  // Set a global accessor for the toast function to allow standalone usage
  if (typeof window !== "undefined") {
    window.__TOAST_FN = useToast().toast;
  }

  return (
    <ToastUIProvider data-toast-provider="true">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastUIProvider>
  )
}

// Also export the provider for apps that need to wrap their own components
export { ToastProvider }
