
import React, { useState } from 'react';
import { useAuthOperations } from '@/contexts/auth/AuthOperationsContext';
import { toast } from '@/hooks/use-toast';

interface ResetPasswordRequestViewProps {
  onBackToSignIn: () => void;
  onResetRequestComplete: (email: string) => void;
}

const ResetPasswordRequestView: React.FC<ResetPasswordRequestViewProps> = ({
  onBackToSignIn,
  onResetRequestComplete
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuthOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      onResetRequestComplete(email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
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
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <button
            type="button"
            onClick={onBackToSignIn}
            className="w-full px-4 py-2 text-blue-600 bg-transparent rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={isLoading}
          >
            Back to Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordRequestView;
