
import React from 'react';
import { ResetPasswordSuccess } from '../ResetPasswordSuccess';

interface ResetPasswordSuccessViewProps {
  goToSignIn: () => void;
}

export const ResetPasswordSuccessView: React.FC<ResetPasswordSuccessViewProps> = ({
  goToSignIn,
}) => {
  return <ResetPasswordSuccess goToSignIn={goToSignIn} />;
};
