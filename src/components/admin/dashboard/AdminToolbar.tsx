
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Bug, Settings, Terminal, Shield } from "lucide-react";

interface AdminToolbarProps {
  showDebugInfo: () => void;
  showDiagnostics?: () => void;
  onRefresh?: () => void;
}

export function AdminToolbar({ showDebugInfo, showDiagnostics, onRefresh }: AdminToolbarProps) {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
      
      <Button variant="outline" size="sm" onClick={showDebugInfo} className="flex items-center gap-1">
        <Terminal className="h-4 w-4" />
        Debug Info
      </Button>
      
      {showDiagnostics && (
        <Button variant="outline" size="sm" onClick={showDiagnostics} className="flex items-center gap-1">
          <Bug className="h-4 w-4" />
          Admin Diagnostics
        </Button>
      )}
      
      <Button variant="outline" size="sm" asChild className="flex items-center gap-1 ml-auto">
        <a href="https://supabase.com/dashboard/project/vcacfysfjgoahledqdwa/auth/users" target="_blank" rel="noopener noreferrer">
          <Shield className="h-4 w-4" />
          Supabase Users
        </a>
      </Button>
    </div>
  );
}
