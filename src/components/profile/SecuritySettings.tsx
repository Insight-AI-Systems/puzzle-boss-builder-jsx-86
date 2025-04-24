
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPasswordStrength } from '@/utils/authValidation';
import { SecurityHeader } from './security/SecurityHeader';
import { SecurityTabs } from './security/SecurityTabs';
import { useSecuritySettings } from '@/hooks/auth/useSecuritySettings';

export function SecuritySettings() {
  const { user } = useAuth();
  const {
    securityLoading,
    sessionsLoading,
    securityError,
    securitySuccess,
    sessions,
    dialogStates,
    formStates,
    handlers
  } = useSecuritySettings();

  // Calculate password strength
  const passwordStrength = getPasswordStrength(formStates.newPassword);

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
          dialogStates={dialogStates}
          formStates={formStates}
          handlers={handlers}
        />
      </CardContent>
    </Card>
  );
}
