
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Bug, Info } from "lucide-react";

interface AdminToolbarProps {
  showDebugInfo: () => void;
  showDiagnostics: () => void;
  onRefresh: () => void;
}

export function AdminToolbar({ showDebugInfo, showDiagnostics, onRefresh }: AdminToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 bg-puzzle-black/20 hover:bg-puzzle-black/30"
        onClick={onRefresh}
      >
        <RefreshCw className="h-4 w-4" />
        <span className="hidden md:inline">Refresh Dashboard</span>
        <span className="inline md:hidden">Refresh</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 bg-puzzle-black/20 hover:bg-puzzle-black/30"
        onClick={showDiagnostics}
      >
        <Bug className="h-4 w-4" />
        <span className="hidden md:inline">Toggle Diagnostics</span>
        <span className="inline md:hidden">Diagnostics</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 bg-puzzle-black/20 hover:bg-puzzle-black/30"
        onClick={showDebugInfo}
      >
        <Info className="h-4 w-4" />
        <span className="hidden md:inline">Debug Info</span>
        <span className="inline md:hidden">Debug</span>
      </Button>
    </div>
  );
}
