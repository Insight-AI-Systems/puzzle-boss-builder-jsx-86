
import React from 'react';
import { SecurityOption } from './SecurityOption';
import { EmailChangeDialog } from './EmailChangeDialog';
import { PasswordChangeDialog } from './PasswordChangeDialog';
import { TwoFactorDialog } from './TwoFactorDialog';
import { AccountDeletionDialog } from './AccountDeletionDialog';

interface AccountSecurityTabProps {
  userEmail?: string | null;
  securityLoading: boolean;
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
  };
}

export function AccountSecurityTab({
  userEmail,
  securityLoading,
  passwordStrength,
  dialogStates,
  formStates,
  handlers
}: AccountSecurityTabProps) {
  return (
    <div className="space-y-4">
      <SecurityOption
        title="Email Address"
        description={userEmail || ''}
        action={
          <EmailChangeDialog
            userEmail={userEmail || ''}
            newEmail={formStates.newEmail}
            currentPassword={formStates.currentPasswordForEmail}
            isLoading={securityLoading}
            showDialog={dialogStates.showEmailDialog}
            setShowDialog={handlers.setShowEmailDialog}
            setNewEmail={handlers.setNewEmail}
            setCurrentPassword={handlers.setCurrentPasswordForEmail}
            onSubmit={handlers.handleEmailChangeSubmit}
          />
        }
      />
      
      <SecurityOption
        title="Password"
        description="Change your account password"
        action={
          <PasswordChangeDialog
            currentPassword={formStates.currentPassword}
            newPassword={formStates.newPassword}
            confirmPassword={formStates.confirmPassword}
            passwordStrength={passwordStrength}
            isLoading={securityLoading}
            showDialog={dialogStates.showPasswordDialog}
            setShowDialog={handlers.setShowPasswordDialog}
            setCurrentPassword={handlers.setCurrentPassword}
            setNewPassword={handlers.setNewPassword}
            setConfirmPassword={handlers.setConfirmPassword}
            onSubmit={handlers.handlePasswordChangeSubmit}
          />
        }
      />
      
      <SecurityOption
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        action={
          <TwoFactorDialog
            enabled={formStates.twoFactorEnabled}
            password={formStates.twoFactorPassword}
            isLoading={securityLoading}
            showDialog={dialogStates.showTwoFactorDialog}
            setShowDialog={handlers.setShowTwoFactorDialog}
            setPassword={handlers.setTwoFactorPassword}
            onSubmit={handlers.handleTwoFactorToggle}
          />
        }
      />
      
      <SecurityOption
        title="Delete Account"
        description="Permanently delete your account and all data"
        action={
          <AccountDeletionDialog
            userEmail={userEmail || ''}
            password={formStates.deletionPassword}
            confirmText={formStates.confirmDeletion}
            isLoading={securityLoading}
            showDialog={dialogStates.showDeletionDialog}
            setShowDialog={handlers.setShowDeletionDialog}
            setPassword={handlers.setDeletionPassword}
            setConfirmText={handlers.setConfirmDeletion}
            onSubmit={handlers.handleAccountDeletion}
          />
        }
      />
    </div>
  );
}
