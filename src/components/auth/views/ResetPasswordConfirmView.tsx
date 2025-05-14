
import React, { useState } from 'react';
import { useAuthOperations } from '@/contexts/auth/AuthOperationsContext';
import { toast } from '@/hooks/use-toast';

interface ResetPasswordConfirmViewProps {
  token: string | null;
  onResetComplete: () => void;
}

const ResetPasswordConfirmView: React.FC<ResetPasswordConfirmViewProps> = ({
  token,
  onResetComplete
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { confirmPasswordReset } = useAuthOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Error",
        description: "Reset token is missing",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await confirmPasswordReset(token, password);
      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      });
      onResetComplete();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Enter your new password below.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirmView;
