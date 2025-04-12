
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Mail, Lock, Bell, Shield, PowerOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Alert,
  AlertDescription
} from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

/**
 * Component that displays account settings for the user
 */
const AccountSettings = ({ user, profile, onSignOut }) => {
  const { toast } = useToast();
  const [currentEmail, setCurrentEmail] = useState(user.email);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  
  // Email notification preferences
  const [emailPrefs, setEmailPrefs] = useState({
    puzzleAlerts: true,
    winningNotifications: true,
    specialOffers: false,
    weeklyNewsletter: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showUsername: true,
    allowRankingDisplay: true,
    showActivityStatus: true
  });
  
  const handleEmailChange = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast({
        title: "Error",
        description: "Please enter a new email address",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // This would be implemented with Supabase auth in a real application
    setTimeout(() => {
      toast({
        title: "Verification email sent",
        description: "Please check your inbox to verify your new email address"
      });
      setLoading(false);
      setNewEmail("");
    }, 1000);
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // This would be implemented with Supabase auth in a real application
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully"
      });
      setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };
  
  const handleToggleSetting = (category, setting) => {
    if (category === 'email') {
      setEmailPrefs({
        ...emailPrefs,
        [setting]: !emailPrefs[setting]
      });
      
      toast({
        title: "Preference updated",
        description: "Your email notification preferences have been saved"
      });
    } else if (category === 'privacy') {
      setPrivacySettings({
        ...privacySettings,
        [setting]: !privacySettings[setting]
      });
      
      toast({
        title: "Privacy setting updated",
        description: "Your privacy settings have been updated"
      });
    }
  };
  
  const handleDeactivateAccount = async () => {
    // This would be implemented with Supabase auth in a real application
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Account deactivated",
        description: "Your account has been deactivated. We're sorry to see you go!"
      });
      setLoading(false);
      
      // Sign the user out
      onSignOut();
    }, 1500);
  };
  
  return (
    <Card className="bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader>
        <CardTitle className="text-puzzle-white flex items-center">
          <Settings className="mr-2 h-5 w-5 text-puzzle-burgundy" />
          Account Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="email" className="border-puzzle-aqua/20">
            <AccordionTrigger className="text-puzzle-white">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-puzzle-aqua" />
                Change Email
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleEmailChange} className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Current Email</label>
                  <Input
                    type="email"
                    value={currentEmail}
                    disabled
                    className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white/70"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">New Email</label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                    className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                  />
                </div>
                <Button 
                  type="submit"
                  className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Verification"}
                </Button>
              </form>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="password" className="border-puzzle-aqua/20">
            <AccordionTrigger className="text-puzzle-white">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-puzzle-aqua" />
                Change Password
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                  />
                </div>
                <Button 
                  type="submit"
                  className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="notifications" className="border-puzzle-aqua/20">
            <AccordionTrigger className="text-puzzle-white">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-puzzle-aqua" />
                Notification Preferences
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {Object.entries(emailPrefs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm text-puzzle-white">
                        {key === 'puzzleAlerts' ? 'New Puzzle Alerts' :
                         key === 'winningNotifications' ? 'Winning Notifications' :
                         key === 'specialOffers' ? 'Special Offers' :
                         key === 'weeklyNewsletter' ? 'Weekly Newsletter' : key}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {key === 'puzzleAlerts' ? 'Get notified when new puzzles are available' :
                         key === 'winningNotifications' ? 'Notifications when you win a prize' :
                         key === 'specialOffers' ? 'Receive special promotions and offers' :
                         key === 'weeklyNewsletter' ? 'Weekly updates and news' : ''}
                      </div>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={value} 
                          onChange={() => handleToggleSetting('email', key)} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-puzzle-black/50 border border-puzzle-aqua/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-puzzle-black after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-puzzle-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-puzzle-aqua"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="privacy" className="border-puzzle-aqua/20">
            <AccordionTrigger className="text-puzzle-white">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-puzzle-aqua" />
                Privacy Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {Object.entries(privacySettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm text-puzzle-white">
                        {key === 'showUsername' ? 'Display Username Publicly' :
                         key === 'allowRankingDisplay' ? 'Show Me in Rankings' :
                         key === 'showActivityStatus' ? 'Show Activity Status' : key}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {key === 'showUsername' ? 'Allow other users to see your username' :
                         key === 'allowRankingDisplay' ? 'Include your stats in public leaderboards' :
                         key === 'showActivityStatus' ? 'Show when you are online to other users' : ''}
                      </div>
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={value} 
                          onChange={() => handleToggleSetting('privacy', key)} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-puzzle-black/50 border border-puzzle-aqua/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-puzzle-black after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-puzzle-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-puzzle-aqua"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="deactivate" className="border-puzzle-aqua/20">
            <AccordionTrigger className="text-puzzle-white">
              <div className="flex items-center">
                <PowerOff className="h-4 w-4 mr-2 text-puzzle-burgundy" />
                Deactivate Account
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {!showDeactivateConfirm ? (
                <div className="space-y-3">
                  <Alert variant="destructive" className="bg-puzzle-burgundy/20 border-puzzle-burgundy text-puzzle-white">
                    <AlertTriangle className="h-4 w-4 text-puzzle-burgundy" />
                    <AlertDescription>
                      Deactivating your account will remove your profile and all personal data. This action cannot be undone.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    variant="outline"
                    className="w-full border-puzzle-burgundy text-puzzle-burgundy hover:bg-puzzle-burgundy/10"
                    onClick={() => setShowDeactivateConfirm(true)}
                  >
                    Request Account Deactivation
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-puzzle-white">Are you sure you want to deactivate your account?</p>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline"
                      className="flex-1 border-puzzle-burgundy bg-puzzle-burgundy text-puzzle-white hover:bg-puzzle-burgundy/90"
                      onClick={handleDeactivateAccount}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Yes, Deactivate"}
                    </Button>
                    <Button 
                      className="flex-1 bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-black/80"
                      onClick={() => setShowDeactivateConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
