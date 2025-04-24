
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, X, Loader2 } from 'lucide-react';
import { SessionInfo } from '@/hooks/auth/useSessionManagement';

interface SessionsTabProps {
  sessions: SessionInfo[];
  isLoading: boolean;
  onTerminateSession: (id: string) => void;
  onTerminateAllOtherSessions: () => void;
}

export function SessionsTab({
  sessions,
  isLoading,
  onTerminateSession,
  onTerminateAllOtherSessions
}: SessionsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Active Sessions</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onTerminateAllOtherSessions}
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out Other Devices
        </Button>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No active sessions found
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div 
              key={session.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                session.is_current ? 'bg-muted border-primary/20' : 'bg-card border-border'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="font-medium">{session.device}</span>
                  {session.is_current && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span>{session.location}</span>
                  <span className="mx-1">•</span>
                  <span>Last active: {session.last_active}</span>
                </div>
              </div>
              
              {!session.is_current && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onTerminateSession(session.id)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
