
import { useEmailChange } from './useEmailChange';
import { usePasswordManagement } from './usePasswordManagement';
import { useTwoFactorAuth } from './useTwoFactorAuth';
import { useAccountDeletion } from './useAccountDeletion';

export function useAccountSecurity() {
  const emailChange = useEmailChange();
  const passwordManagement = usePasswordManagement();
  const twoFactorAuth = useTwoFactorAuth();
  const accountDeletion = useAccountDeletion();

  return {
    isLoading: emailChange.isLoading || passwordManagement.isLoading || 
               twoFactorAuth.isLoading || accountDeletion.isLoading,
    error: emailChange.error || passwordManagement.error || 
           twoFactorAuth.error || accountDeletion.error,
    successMessage: emailChange.successMessage || passwordManagement.successMessage || 
                   twoFactorAuth.successMessage,
    setError: (error: string | null) => {
      emailChange.setError(error);
      passwordManagement.setError(error);
      twoFactorAuth.setError(error);
      accountDeletion.setError(error);
    },
    setSuccessMessage: (message: string | null) => {
      emailChange.setSuccessMessage(message);
      passwordManagement.setSuccessMessage(message);
      twoFactorAuth.setSuccessMessage(message);
    },
    initiateEmailChange: emailChange.initiateEmailChange,
    confirmEmailChange: emailChange.confirmEmailChange,
    changePassword: passwordManagement.changePassword,
    toggleTwoFactorAuth: twoFactorAuth.toggleTwoFactorAuth,
    deleteAccount: accountDeletion.deleteAccount
  };
}
