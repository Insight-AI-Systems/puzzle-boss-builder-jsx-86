
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccountSecurity } from '@/hooks/auth/useAccountSecurity';
import { useSessionManagement } from '@/hooks/auth/useSessionManagement';
import { getPasswordStrength } from '@/utils/authValidation';
import { SecurityHeader } from './security/SecurityHeader';
import { SecurityTabs } from './security/SecurityTabs';

export function SecuritySettings() {
  const { user } = useAuth();
  const { 
    isLoading: securityLoading, 
    error: securityError,
    successMessage: securitySuccess,
    initiateEmailChange,
    changePassword,
    toggleTwoFactorAuth,
    deleteAccount
  } = useAccountSecurity();
  
  const {
    sessions,
    isLoading: sessionsLoading,
    terminateSession,
    terminateAllOtherSessions
  } = useSessionManagement();
  
  // State management for each dialog
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [showDeletionDialog, setShowDeletionDialog] = useState(false);
  
  // Form state
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorPassword, setTwoFactorPassword] = useState('');
  const [deletionPassword, setDeletionPassword] = useState('');
  const [confirmDeletion, setConfirmDeletion] = useState('');
  
  // Calculate password strength
  const passwordStrength = getPasswordStrength(newPassword);
  
  // Form submission handlers
  const handleEmailChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await initiateEmailChange(newEmail, currentPasswordForEmail);
    if (!securityError) {
      setShowEmailDialog(false);
      setNewEmail('');
      setCurrentPasswordForEmail('');
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await changePassword(currentPassword, newPassword);
    if (!securityError) {
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleTwoFactorToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    await toggleTwoFactorAuth(!twoFactorEnabled, twoFactorPassword);
    if (!securityError) {
      setShowTwoFactorDialog(false);
      setTwoFactorPassword('');
      setTwoFactorEnabled(!twoFactorEnabled);
    }
  };

  const handleAccountDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || confirmDeletion !== user.email) return;
    await deleteAccount(deletionPassword);
    if (!securityError) {
      setShowDeletionDialog(false);
      setDeletionPassword('');
      setConfirmDeletion('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-puzzle-aqua" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Manage your account security, sessions, and privacy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SecurityHeader error={securityError} successMessage={securitySuccess} />
        
        <SecurityTabs
          userEmail={user?.email}
          securityLoading={securityLoading}
          sessions={sessions}
          sessionsLoading={sessionsLoading}
          passwordStrength={passwordStrength}
          dialogStates={{
            showEmailDialog,
            showPasswordDialog,
            showTwoFactorDialog,
            showDeletionDialog
          }}
          formStates={{
            newEmail,
            currentPasswordForEmail,
            currentPassword,
            newPassword,
            confirmPassword,
            twoFactorEnabled,
            twoFactorPassword,
            deletionPassword,
            confirmDeletion
          }}
          handlers={{
            setShowEmailDialog,
            setShowPasswordDialog,
            setShowTwoFactorDialog,
            setShowDeletionDialog,
            setNewEmail,
            setCurrentPasswordForEmail,
            setCurrentPassword,
            setNewPassword,
            setConfirmPassword,
            setTwoFactorPassword,
            setDeletionPassword,
            setConfirmDeletion,
            handleEmailChangeSubmit,
            handlePasswordChangeSubmit,
            handleTwoFactorToggle,
            handleAccountDeletion,
            terminateSession,
            terminateAllOtherSessions
          }}
        />
      </CardContent>
    </Card>
  );
}
