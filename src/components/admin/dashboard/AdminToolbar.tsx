
import React from 'react';
import { Bug } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { debugAuthState, forceProtectedAdminAccess } from '@/utils/admin/debugAuth';

interface AdminToolbarProps {
  showDebugInfo: () => void;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({ showDebugInfo }) => (
  <div className="mb-6 space-y-2">
    <h2 className="text-xl font-game text-puzzle-gold">Admin Tools</h2>
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => debugAuthState()} variant="outline" size="sm">
        Debug Auth State
      </Button>
      <Button onClick={() => forceProtectedAdminAccess()} variant="outline" size="sm">
        Force Admin Access
      </Button>
      <Button onClick={showDebugInfo} variant="outline" size="sm">
        <Bug className="h-4 w-4 mr-1" />
        Show Debug Info
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link to="/puzzle-playground">
          Open Puzzle Engine Test Playground
        </Link>
      </Button>
    </div>
  </div>
);
