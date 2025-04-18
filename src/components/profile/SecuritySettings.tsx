
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Shield, LogOut, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useAccountSecurity } from '@/hooks/auth/useAccountSecurity';
import { useSessionManagement, SessionInfo } from '@/hooks/auth/useSessionManagement';
import { getPasswordStrength } from '@/utils/authValidation';
import { SecurityHeader } from './security/SecurityHeader';
import { EmailChangeDialog } from './security/EmailChangeDialog';
import { PasswordChangeDialog } from './security/PasswordChangeDialog';
import { TwoFactorDialog } from './security/TwoFactorDialog';
import { AccountDeletionDialog } from './security/AccountDeletionDialog';

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
        
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account Security</TabsTrigger>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <EmailChangeDialog
                  userEmail={user?.email || ''}
                  newEmail={newEmail}
                  currentPassword={currentPasswordForEmail}
                  isLoading={securityLoading}
                  showDialog={showEmailDialog}
                  setShowDialog={setShowEmailDialog}
                  setNewEmail={setNewEmail}
                  setCurrentPassword={setCurrentPasswordForEmail}
                  onSubmit={handleEmailChangeSubmit}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <PasswordChangeDialog
                  currentPassword={currentPassword}
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  passwordStrength={passwordStrength}
                  isLoading={securityLoading}
                  showDialog={showPasswordDialog}
                  setShowDialog={setShowPasswordDialog}
                  setCurrentPassword={setCurrentPassword}
                  setNewPassword={setNewPassword}
                  setConfirmPassword={setConfirmPassword}
                  onSubmit={handlePasswordChangeSubmit}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <TwoFactorDialog
                  enabled={twoFactorEnabled}
                  password={twoFactorPassword}
                  isLoading={securityLoading}
                  showDialog={showTwoFactorDialog}
                  setShowDialog={setShowTwoFactorDialog}
                  setPassword={setTwoFactorPassword}
                  onSubmit={handleTwoFactorToggle}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-500">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <AccountDeletionDialog
                  userEmail={user?.email || ''}
                  password={deletionPassword}
                  confirmText={confirmDeletion}
                  isLoading={securityLoading}
                  showDialog={showDeletionDialog}
                  setShowDialog={setShowDeletionDialog}
                  setPassword={setDeletionPassword}
                  setConfirmText={setConfirmDeletion}
                  onSubmit={handleAccountDeletion}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Active Sessions</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={terminateAllOtherSessions}
                  disabled={sessionsLoading}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out Other Devices
                </Button>
              </div>
              
              {sessionsLoading ? (
                <div className="py-8 text-center text-muted-foreground">
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No active sessions found
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session: SessionInfo) => (
                    <div 
                      key={session.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        session.is_current ? 'bg-muted border-primary/20' : 'bg-card border-border'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="font-medium">{session.device}</span>
                          {session.is_current && (
                            <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span>{session.location}</span>
                          <span className="mx-1">•</span>
                          <span>Last active: {session.last_active}</span>
                        </div>
                      </div>
                      
                      {!session.is_current && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => terminateSession(session.id)}
                          disabled={sessionsLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
