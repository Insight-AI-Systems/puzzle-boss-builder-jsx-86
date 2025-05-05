
import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import AuthenticatedUserCard from './auth/AuthenticatedUserCard';
import SignInCard from './auth/SignInCard';

interface AuthSectionProps {
  puzzleId: string;
}

const AuthSection: React.FC<AuthSectionProps> = ({ puzzleId }) => {
  const { isAuthenticated, user } = useAuth();
  const { handleSignIn } = useAuthRedirect();

  if (isAuthenticated && user) {
    return <AuthenticatedUserCard user={user} />;
  }

  return <SignInCard onSignIn={handleSignIn} />;
};

export default AuthSection;
