
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSecurityTab } from './AccountSecurityTab';
import { SessionsTab } from './SessionsTab';
import { SessionInfo } from '@/hooks/auth/useSessionManagement';

interface SecurityTabsProps {
  userEmail?: string | null;
  securityLoading: boolean;
  sessions: SessionInfo[];
  sessionsLoading: boolean;
  passwordStrength: { score: number; label: string };
  dialogStates: {
    showEmailDialog: boolean;
    showPasswordDialog: boolean;
    showTwoFactorDialog: boolean;
    showDeletionDialog: boolean;
  };
  formStates: {
    newEmail: string;
    currentPasswordForEmail: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorEnabled: boolean;
    twoFactorPassword: string;
    deletionPassword: string;
    confirmDeletion: string;
  };
  handlers: {
    setShowEmailDialog: (show: boolean) => void;
    setShowPasswordDialog: (show: boolean) => void;
    setShowTwoFactorDialog: (show: boolean) => void;
    setShowDeletionDialog: (show: boolean) => void;
    setNewEmail: (email: string) => void;
    setCurrentPasswordForEmail: (password: string) => void;
    setCurrentPassword: (password: string) => void;
    setNewPassword: (password: string) => void;
    setConfirmPassword: (password: string) => void;
    setTwoFactorPassword: (password: string) => void;
    setDeletionPassword: (password: string) => void;
    setConfirmDeletion: (text: string) => void;
    handleEmailChangeSubmit: (e: React.FormEvent) => void;
    handlePasswordChangeSubmit: (e: React.FormEvent) => void;
    handleTwoFactorToggle: (e: React.FormEvent) => void;
    handleAccountDeletion: (e: React.FormEvent) => void;
    terminateSession: (id: string) => void;
    terminateAllOtherSessions: () => void;
  };
}

export function SecurityTabs({
  userEmail,
  securityLoading,
  sessions,
  sessionsLoading,
  passwordStrength,
  dialogStates,
  formStates,
  handlers
}: SecurityTabsProps) {
  return (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account Security</TabsTrigger>
        <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="space-y-4 pt-4">
        <AccountSecurityTab
          userEmail={userEmail}
          securityLoading={securityLoading}
          passwordStrength={passwordStrength}
          dialogStates={dialogStates}
          formStates={formStates}
          handlers={handlers}
        />
      </TabsContent>
      
      <TabsContent value="sessions" className="space-y-4 pt-4">
        <SessionsTab
          sessions={sessions}
          isLoading={sessionsLoading}
          onTerminateSession={handlers.terminateSession}
          onTerminateAllOtherSessions={handlers.terminateAllOtherSessions}
        />
      </TabsContent>
    </Tabs>
  );
}
