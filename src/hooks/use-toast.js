
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

// Create the toast function to match the expected export
const toast = function(props) {
  // Get the toast function from the hook
  const { toast: toastFn } = useShadcnToast();
  // Call it with the provided props
  return toastFn(props);
};

// Export both the hook and the toast function
function useToast() {
  return useShadcnToast();
}

export { useToast, toast };
