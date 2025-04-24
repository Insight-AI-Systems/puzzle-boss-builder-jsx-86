
import { useState } from 'react';
import { useAccountSecurity } from './useAccountSecurity';
import { useSessionManagement } from './useSessionManagement';

export function useSecuritySettings() {
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

  // Dialog states
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [showDeletionDialog, setShowDeletionDialog] = useState(false);

  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorPassword, setTwoFactorPassword] = useState('');
  const [deletionPassword, setDeletionPassword] = useState('');
  const [confirmDeletion, setConfirmDeletion] = useState('');

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
    await deleteAccount(deletionPassword);
    if (!securityError) {
      setShowDeletionDialog(false);
      setDeletionPassword('');
      setConfirmDeletion('');
    }
  };

  return {
    // Loading states
    securityLoading,
    sessionsLoading,
    
    // Error and success states
    securityError,
    securitySuccess,
    
    // Session data
    sessions,
    
    // Dialog states
    dialogStates: {
      showEmailDialog,
      showPasswordDialog,
      showTwoFactorDialog,
      showDeletionDialog
    },
    
    // Form states
    formStates: {
      newEmail,
      currentPasswordForEmail,
      currentPassword,
      newPassword,
      confirmPassword,
      twoFactorEnabled,
      twoFactorPassword,
      deletionPassword,
      confirmDeletion
    },
    
    // Dialog handlers
    handlers: {
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
    }
  };
}
