
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BetaBanner() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-puzzle-aqua/10 border-b border-puzzle-aqua/20 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-puzzle-aqua" />
          <span>
            Beta Testing Version - 
            <Link to="/known-issues" className="ml-1 text-puzzle-aqua hover:underline">
              View Known Issues
            </Link>
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-puzzle-aqua hover:text-puzzle-aqua/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
