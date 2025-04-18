
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccountSecurity } from '@/hooks/auth/useAccountSecurity';
import { useSessionManagement, SessionInfo } from '@/hooks/auth/useSessionManagement';
import { AlertCircle, Key, Mail, Shield, Trash2, X, LogOut, Info } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordStrengthIndicator } from '../auth/PasswordStrengthIndicator';
import { getPasswordStrength } from '@/utils/authValidation';

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
  
  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  // Two-factor state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorPassword, setTwoFactorPassword] = useState('');
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  
  // Account deletion state
  const [deletionPassword, setDeletionPassword] = useState('');
  const [showDeletionDialog, setShowDeletionDialog] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState('');
  
  // Handle email change
  const handleEmailChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await initiateEmailChange(newEmail, currentPasswordForEmail);
    if (!securityError) {
      setShowEmailDialog(false);
      setNewEmail('');
      setCurrentPasswordForEmail('');
    }
  };
  
  // Handle password change
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return; // Form validation should prevent this
    }
    await changePassword(currentPassword, newPassword);
    if (!securityError) {
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };
  
  // Handle two-factor toggle
  const handleTwoFactorToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    await toggleTwoFactorAuth(!twoFactorEnabled, twoFactorPassword);
    if (!securityError) {
      setShowTwoFactorDialog(false);
      setTwoFactorPassword('');
      setTwoFactorEnabled(!twoFactorEnabled);
    }
  };
  
  // Handle account deletion
  const handleAccountDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmDeletion !== user?.email) {
      return; // Form validation should prevent this
    }
    await deleteAccount(deletionPassword);
    if (!securityError) {
      setShowDeletionDialog(false);
      setDeletionPassword('');
      setConfirmDeletion('');
    }
  };
  
  // Calculate password strength
  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Security Settings</CardTitle>
        <CardDescription>
          Manage your account security, sessions, and privacy
        </CardDescription>
      </CardHeader>
      <CardContent>
        {securityError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{securityError}</AlertDescription>
          </Alert>
        )}
        
        {securitySuccess && (
          <Alert className="mb-4 bg-green-900/30 border-green-500">
            <Info className="h-4 w-4 text-green-500" />
            <AlertDescription>{securitySuccess}</AlertDescription>
          </Alert>
        )}
        
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
                <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Change
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Email Address</DialogTitle>
                      <DialogDescription>
                        Enter your new email address and current password to verify.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEmailChangeSubmit}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-email">Current Email</Label>
                          <Input
                            id="current-email"
                            value={user?.email || ''}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-email">New Email</Label>
                          <Input
                            id="new-email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="current-password-email">Current Password</Label>
                          <Input
                            id="current-password-email"
                            type="password"
                            value={currentPasswordForEmail}
                            onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowEmailDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={securityLoading}>
                          {securityLoading ? 'Processing...' : 'Change Email'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Change
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and a new password.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePasswordChangeSubmit}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                          <PasswordStrengthIndicator 
                            score={passwordStrength.score} 
                            label={passwordStrength.label} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-500">Passwords do not match</p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={
                            securityLoading || 
                            !newPassword || 
                            newPassword !== confirmPassword ||
                            passwordStrength.score < 50
                          }
                        >
                          {securityLoading ? 'Processing...' : 'Change Password'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
                  <DialogTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={() => setShowTwoFactorDialog(true)}
                      />
                      <span className="text-sm">
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
                      </DialogTitle>
                      <DialogDescription>
                        {twoFactorEnabled 
                          ? 'This will remove the extra security from your account.' 
                          : 'This will add an extra layer of security to your account.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleTwoFactorToggle}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="two-factor-password">Confirm Password</Label>
                          <Input
                            id="two-factor-password"
                            type="password"
                            value={twoFactorPassword}
                            onChange={(e) => setTwoFactorPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowTwoFactorDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          variant={twoFactorEnabled ? "destructive" : "default"}
                          disabled={securityLoading || !twoFactorPassword}
                        >
                          {securityLoading ? 'Processing...' : (
                            twoFactorEnabled ? 'Disable Two-Factor' : 'Enable Two-Factor'
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-500">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Dialog open={showDeletionDialog} onOpenChange={setShowDeletionDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-red-500">Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Your account and all associated data will be permanently deleted.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAccountDeletion}>
                      <div className="space-y-4 py-4">
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Warning</AlertTitle>
                          <AlertDescription>
                            This will permanently delete your account, profile information, and all data associated with your account.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-2">
                          <Label htmlFor="deletion-password">Enter your password</Label>
                          <Input
                            id="deletion-password"
                            type="password"
                            value={deletionPassword}
                            onChange={(e) => setDeletionPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-deletion">
                            Type <span className="font-semibold">{user?.email}</span> to confirm
                          </Label>
                          <Input
                            id="confirm-deletion"
                            type="text"
                            value={confirmDeletion}
                            onChange={(e) => setConfirmDeletion(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowDeletionDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          variant="destructive"
                          disabled={
                            securityLoading || 
                            !deletionPassword || 
                            confirmDeletion !== user?.email
                          }
                        >
                          {securityLoading ? 'Processing...' : 'Permanently Delete Account'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
