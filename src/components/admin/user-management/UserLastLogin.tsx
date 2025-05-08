
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserLastLoginProps {
  lastSignIn: string | null | undefined;
}

export function UserLastLogin({ lastSignIn }: UserLastLoginProps) {
  if (!lastSignIn) {
    return <span className="text-muted-foreground text-sm">Never</span>;
  }

  try {
    const loginDate = new Date(lastSignIn);
    const formattedDate = loginDate.toLocaleDateString();
    const formattedTime = loginDate.toLocaleTimeString();
    const relativeTime = formatDistanceToNow(loginDate, { addSuffix: true });

    // Determine if the login was recent (within last 24 hours)
    const isRecent = Date.now() - loginDate.getTime() < 24 * 60 * 60 * 1000;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
              <span className={isRecent ? "text-green-500 font-medium" : ""}>
                {relativeTime}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {formattedDate} at {formattedTime}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } catch (e) {
    // Fallback if date parsing fails
    return <span className="text-muted-foreground text-sm">Invalid date</span>;
  }
}
