
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bug, Shield, Info } from "lucide-react";

interface AdminToolbarProps {
  showDebugInfo: () => void;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({ showDebugInfo }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-puzzle-white">Admin Dashboard</h1>
        <p className="text-puzzle-white/70">Database Role-Based Access Control</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={showDebugInfo}
          variant="outline" 
          size="sm"
          className="border-puzzle-aqua/50 text-puzzle-aqua hover:bg-puzzle-aqua/10"
        >
          <Bug className="h-4 w-4 mr-1" />
          Debug Info
        </Button>
      </div>
    </div>
  );
};
