
import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  centered?: boolean;
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = "md", centered = false, className, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    };
    
    const containerClasses = centered 
      ? "flex items-center justify-center w-full h-full" 
      : "";
    
    return (
      <div ref={ref} className={cn(containerClasses, className)} {...props}>
        <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size])} />
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";
