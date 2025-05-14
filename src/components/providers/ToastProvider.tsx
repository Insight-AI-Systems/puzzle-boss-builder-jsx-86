
import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster 
      closeButton
      richColors
      position="bottom-right"
      toastOptions={{
        className: "rounded-md border shadow-md p-4",
        style: { 
          backgroundColor: "hsl(var(--background))",
          color: "hsl(var(--foreground))"
        },
      }}
    />
  );
}
