
import React, { useRef, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";

interface IndeterminateCheckboxProps extends CheckboxProps {
  indeterminate?: boolean;
}

export const IndeterminateCheckbox = React.forwardRef<
  HTMLButtonElement,
  IndeterminateCheckboxProps
>(({ indeterminate = false, ...props }, forwardedRef) => {
  const ref = useRef<HTMLButtonElement>(null);
  
  // Use forwarded ref if available, otherwise use local ref
  const resolvedRef = (forwardedRef || ref) as React.RefObject<HTMLButtonElement>;
  
  useEffect(() => {
    if (resolvedRef.current) {
      // Use property accessor because TypeScript doesn't know about indeterminate
      (resolvedRef.current as any).indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return <Checkbox ref={resolvedRef} {...props} />;
});

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';
