
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, User, CreditCard, Bell, Lock, Shield, Wrench, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

const AccountManagement = () => {
  return (
    <PageLayout
      title="Account Management"
      subtitle="Learn how to manage your profile, subscriptions, and security settings"
      className="prose prose-invert prose-headings:text-puzzle-white prose-a:text-puzzle-aqua max-w-4xl"
    >
      <div className="flex items-center text-muted-foreground text-sm mb-6">
        <Link to="/" className="hover:text-puzzle-aqua">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/support" className="hover:text-puzzle-aqua">Support</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-puzzle-aqua">Account Management</span>
      </div>

      <div className="mb-8">
        <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-puzzle-aqua mb-4">
              <User className="h-8 w-8" />
              <h2 className="text-2xl font-bold m-0">Managing Your Puzzle Boss Account</h2>
            </div>
            <p className="text-muted-foreground">
              This guide covers everything you need to know about managing your Puzzle Boss account, from updating your profile to securing your account and managing subscriptions.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="#profile-settings" className="no-underline">
            <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 h-full hover:border-puzzle-aqua transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <User className="h-10 w-10 text-puzzle-aqua mb-2" />
                  <h3 className="text-lg font-bold text-puzzle-white mb-1">Profile Settings</h3>
                  <p className="text-muted-foreground text-sm">
                    Update your personal information and display preferences
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="#membership-and-billing" className="no-underline">
            <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 h-full hover:border-puzzle-aqua transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <CreditCard className="h-10 w-10 text-puzzle-aqua mb-2" />
                  <h3 className="text-lg font-bold text-puzzle-white mb-1">Membership & Billing</h3>
                  <p className="text-muted-foreground text-sm">
                    Manage your subscription and payment methods
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="#security-and-privacy" className="no-underline">
            <Card className="bg-puzzle-black/30 border-puzzle-aqua/20 h-full hover:border-puzzle-aqua transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-10 w-10 text-puzzle-aqua mb-2" />
                  <h3 className="text-lg font-bold text-puzzle-white mb-1">Security & Privacy</h3>
                  <p className="text-muted-foreground text-sm">
                    Protect your account and manage your data
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Separator className="my-8" id="profile-settings" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Profile Settings</h2>
        <p className="text-muted-foreground mb-6">
          Your profile represents you on the Puzzle Boss platform. Here's how to manage your profile information:
        </p>
        
        <div className="space-y-6 mb-8">
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Personal Information</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <p className="text-muted-foreground mb-4">
                To update your personal information:
              </p>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to your Account Dashboard</li>
                <li>Select the "Profile" tab</li>
                <li>Click "Edit Profile"</li>
                <li>Update your name, email, or other information</li>
                <li>Click "Save Changes"</li>
              </ol>
              <Alert className="bg-puzzle-aqua/10 border-puzzle-aqua/20">
                <AlertTriangle className="h-4 w-4 text-puzzle-aqua" />
                <AlertTitle className="text-puzzle-white">Email Changes</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  When changing your email address, you'll need to verify the new address before the change takes effect.
                </AlertDescription>
              </Alert>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Notification Preferences</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <p className="text-muted-foreground mb-4">
                Customize what notifications you receive and how:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li><span className="text-puzzle-white font-medium">Email Notifications:</span> New contests, wins, promotions, etc.</li>
                <li><span className="text-puzzle-white font-medium">In-App Notifications:</span> Puzzle completions, credit purchases, etc.</li>
                <li><span className="text-puzzle-white font-medium">Push Notifications:</span> Real-time alerts about contest results and wins</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                To update notification preferences:
              </p>
              <ol className="space-y-2 text-muted-foreground">
                <li>Go to Account Dashboard</li>
                <li>Select the "Notifications" tab</li>
                <li>Toggle on/off different notification types</li>
                <li>Click "Save Preferences"</li>
              </ol>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Display Preferences</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <p className="text-muted-foreground mb-4">
                Customize how the platform looks and behaves for you:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li><span className="text-puzzle-white font-medium">Theme Settings:</span> Choose between light and dark mode</li>
                <li><span className="text-puzzle-white font-medium">Leaderboard Display:</span> Show/hide your name on public leaderboards</li>
                <li><span className="text-puzzle-white font-medium">Puzzle Interface:</span> Customize the puzzle solving experience</li>
              </ul>
              <p className="text-muted-foreground">
                To update display preferences, go to Account Dashboard > Settings > Display.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Separator className="my-8" id="membership-and-billing" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Membership & Billing</h2>
        <p className="text-muted-foreground mb-6">
          Manage your subscription, credits, and payment methods:
        </p>
        
        <div className="space-y-6 mb-8">
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Managing Your Subscription</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <h4 className="text-puzzle-white font-medium mb-2">Upgrading Your Membership</h4>
              <p className="text-muted-foreground mb-4">
                To upgrade to a Premium or Pro membership:
              </p>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to Account Dashboard > Membership</li>
                <li>View available subscription tiers</li>
                <li>Select your preferred plan</li>
                <li>Choose billing frequency (monthly/annual)</li>
                <li>Complete payment to activate</li>
              </ol>
              
              <h4 className="text-puzzle-white font-medium mb-2">Changing or Cancelling Your Subscription</h4>
              <p className="text-muted-foreground mb-4">
                To modify or cancel your current subscription:
              </p>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to Account Dashboard > Membership</li>
                <li>Select "Manage Subscription"</li>
                <li>Choose "Change Plan" or "Cancel Subscription"</li>
                <li>Follow the prompts to complete your request</li>
              </ol>
              
              <Alert className="bg-puzzle-aqua/10 border-puzzle-aqua/20">
                <AlertTriangle className="h-4 w-4 text-puzzle-aqua" />
                <AlertDescription className="text-muted-foreground">
                  Cancellations take effect at the end of your current billing period. You'll maintain access to premium features until then.
                </AlertDescription>
              </Alert>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Payment Methods</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <p className="text-muted-foreground mb-4">
                You can add, update, or remove payment methods from your account at any time:
              </p>
              
              <h4 className="text-puzzle-white font-medium mb-2">Adding a Payment Method</h4>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to Account Dashboard > Billing</li>
                <li>Select "Add Payment Method"</li>
                <li>Choose card type or payment service</li>
                <li>Enter payment details</li>
                <li>Set as default (optional)</li>
              </ol>
              
              <h4 className="text-puzzle-white font-medium mb-2">Updating Payment Information</h4>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to Account Dashboard > Billing</li>
                <li>Find the payment method to update</li>
                <li>Click "Edit" and make changes</li>
                <li>Save your changes</li>
              </ol>
              
              <p className="text-muted-foreground">
                We accept major credit cards, PayPal, and select regional payment methods. All payment information is encrypted and securely stored.
              </p>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Credits & Transactions</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <h4 className="text-puzzle-white font-medium mb-2">Purchasing Credits</h4>
              <p className="text-muted-foreground mb-4">
                To buy additional credits:
              </p>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to Account Dashboard > Credits</li>
                <li>Select "Buy Credits"</li>
                <li>Choose a credit package</li>
                <li>Select payment method</li>
                <li>Complete purchase</li>
              </ol>
              
              <h4 className="text-puzzle-white font-medium mb-2">Viewing Transaction History</h4>
              <p className="text-muted-foreground mb-4">
                To review past purchases and credit usage:
              </p>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to Account Dashboard > Billing</li>
                <li>Select "Transaction History"</li>
                <li>Filter by date or transaction type</li>
                <li>Download records (optional)</li>
              </ol>
              
              <Alert className="bg-puzzle-aqua/10 border-puzzle-aqua/20">
                <AlertTriangle className="h-4 w-4 text-puzzle-aqua" />
                <AlertDescription className="text-muted-foreground">
                  Credits never expire, but are non-refundable once purchased.
                </AlertDescription>
              </Alert>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Separator className="my-8" id="security-and-privacy" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Security & Privacy</h2>
        <p className="text-muted-foreground mb-6">
          Protecting your account and personal information is our priority. Here's how you can manage your security settings:
        </p>
        
        <div className="space-y-6 mb-8">
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Password Management</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <h4 className="text-puzzle-white font-medium mb-2">Changing Your Password</h4>
              <p className="text-muted-foreground mb-4">
                To update your password:
              </p>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to Account Dashboard > Security</li>
                <li>Select "Change Password"</li>
                <li>Enter your current password</li>
                <li>Create and confirm your new password</li>
                <li>Click "Update Password"</li>
              </ol>
              
              <h4 className="text-puzzle-white font-medium mb-2">Password Requirements</h4>
              <p className="text-muted-foreground mb-4">
                For maximum security, your password should:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>Be at least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Contain at least one number</li>
                <li>Include at least one special character</li>
                <li>Not match previously used passwords</li>
              </ul>
              
              <div className="bg-puzzle-aqua/10 p-4 rounded-lg">
                <h4 className="text-puzzle-white font-medium mb-2">Security Tip</h4>
                <p className="text-muted-foreground">
                  Change your password regularly and never use the same password across multiple sites.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Two-Factor Authentication</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <p className="text-muted-foreground mb-4">
                Two-factor authentication (2FA) adds an extra layer of security to your account by requiring a second verification step during login.
              </p>
              
              <h4 className="text-puzzle-white font-medium mb-2">Enabling 2FA</h4>
              <ol className="space-y-2 text-muted-foreground mb-4">
                <li>Go to Account Dashboard > Security</li>
                <li>Select "Two-Factor Authentication"</li>
                <li>Choose your preferred 2FA method (app, SMS, email)</li>
                <li>Follow the setup instructions</li>
                <li>Save your recovery codes in a safe place</li>
              </ol>
              
              <h4 className="text-puzzle-white font-medium mb-2">Recovery Options</h4>
              <p className="text-muted-foreground mb-4">
                If you lose access to your 2FA device:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>Use one of your saved recovery codes</li>
                <li>Use an alternate verification method if configured</li>
                <li>Contact support if all else fails</li>
              </ul>
              
              <Alert className="bg-puzzle-gold/10 border-puzzle-gold">
                <AlertTriangle className="h-4 w-4 text-puzzle-gold" />
                <AlertTitle className="text-puzzle-gold">Important</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Two-factor authentication is required for accounts with high-value prize claims or premium memberships.
                </AlertDescription>
              </Alert>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border border-puzzle-aqua/20 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-puzzle-black/50 hover:bg-puzzle-aqua/10 text-left">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-puzzle-aqua" />
                <h3 className="text-puzzle-white text-lg font-medium m-0">Privacy Settings</h3>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t border-puzzle-aqua/20">
              <p className="text-muted-foreground mb-4">
                Control how your information is used and displayed on the platform:
              </p>
              
              <h4 className="text-puzzle-white font-medium mb-2">Profile Privacy</h4>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li><span className="text-puzzle-white font-medium">Public Profile:</span> Control what information is visible to other users</li>
                <li><span className="text-puzzle-white font-medium">Leaderboard Visibility:</span> Show/hide your name on public leaderboards</li>
                <li><span className="text-puzzle-white font-medium">Activity Sharing:</span> Control whether your wins and achievements are shared</li>
              </ul>
              
              <h4 className="text-puzzle-white font-medium mb-2">Data Management</h4>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li><span className="text-puzzle-white font-medium">Data Download:</span> Request a copy of your personal data</li>
                <li><span className="text-puzzle-white font-medium">Account Deletion:</span> Permanently remove your account and data</li>
                <li><span className="text-puzzle-white font-medium">Cookie Preferences:</span> Manage how we use cookies and tracking technologies</li>
              </ul>
              
              <p className="text-muted-foreground">
                To update privacy settings, go to Account Dashboard > Privacy.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Account Security Best Practices</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>Use a strong, unique password for your Puzzle Boss account</li>
            <li>Enable two-factor authentication for added security</li>
            <li>Never share your account credentials with anyone</li>
            <li>Be cautious of phishing attempts—we'll never ask for your password via email</li>
            <li>Keep your email address up to date to receive security notifications</li>
            <li>Sign out when using shared or public computers</li>
            <li>Regularly review your account activity for unauthorized actions</li>
          </ul>
        </div>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Need More Help?</h2>
        <p className="text-muted-foreground mb-6">
          If you have any questions about managing your account or need assistance with a specific issue, our support team is here to help.
        </p>
        
        <div className="text-center mb-8">
          <Link to="/support">
            <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountManagement;
