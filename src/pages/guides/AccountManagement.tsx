
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ChevronRight, Settings, User, CreditCard, Shield, Bell, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedJigsawPuzzle from '@/components/puzzles/engines/EnhancedJigsawPuzzle';

const AccountManagement = () => {
  return (
    <PageLayout
      title="Account Management Guide"
      subtitle="Everything you need to know about managing your Puzzle Boss account"
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
              <h2 className="text-2xl font-bold m-0">Managing Your Account</h2>
            </div>
            <p className="text-muted-foreground">
              This guide covers everything you need to know about managing your Puzzle Boss account, 
              from updating your profile to managing subscriptions and security settings.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Profile Settings</h2>
        <p className="text-muted-foreground mb-4">
          Your profile represents you on The Puzzle Boss platform. Here's how to keep it updated:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <User className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Display Name</h3>
              <p className="text-muted-foreground">
                Your display name appears on leaderboards and in competitions. To change it:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link></li>
                <li>Click on the "Profile" tab</li>
                <li>Update your display name in the field provided</li>
                <li>Click "Save Changes"</li>
              </ol>
              <p className="text-muted-foreground mt-2">
                <span className="text-puzzle-white font-medium">Note:</span> You can change your display name once every 30 days.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <User className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Profile Picture</h3>
              <p className="text-muted-foreground">
                Your profile picture helps other players recognize you. To update it:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link></li>
                <li>Click on the "Profile" tab</li>
                <li>Click on your current profile picture or the upload icon</li>
                <li>Select a new image from your device (JPG, PNG, or GIF, max 5MB)</li>
                <li>Crop as needed and click "Save"</li>
              </ol>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Settings className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Account Information</h3>
              <p className="text-muted-foreground">
                Keep your email and contact information up to date for important account notifications:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link></li>
                <li>Click on the "Account" tab</li>
                <li>Update your email address, phone number, or address as needed</li>
                <li>Click "Save Changes"</li>
                <li>You may need to verify a new email address by clicking a link sent to that address</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Pro Tip: Account Linking</h3>
          <p className="text-muted-foreground">
            Link your social media accounts to make signing in easier and to enable social features. 
            Go to "Settings" {">"} "Connected Accounts" to link your Facebook, Google, or Apple account.
          </p>
        </div>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Payment & Subscription Management</h2>
        <p className="text-muted-foreground mb-4">
          Managing your payment methods and subscriptions is easy on The Puzzle Boss:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <CreditCard className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Adding Payment Methods</h3>
              <p className="text-muted-foreground">
                To add a new credit card or payment method:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Billing"</li>
                <li>Click "Add Payment Method"</li>
                <li>Enter your card details or select another payment option</li>
                <li>Click "Save Payment Method"</li>
              </ol>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <CreditCard className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Managing Subscriptions</h3>
              <p className="text-muted-foreground">
                To change, upgrade, or cancel your subscription:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Subscriptions"</li>
                <li>View your current subscription details</li>
                <li>Click "Upgrade" to move to a higher tier</li>
                <li>Click "Change Plan" to switch to a different plan</li>
                <li>Click "Cancel Subscription" to end your subscription at the next billing cycle</li>
              </ol>
              <p className="text-muted-foreground mt-2">
                <span className="text-puzzle-white font-medium">Note:</span> Canceling a subscription does not provide a refund for the current billing period. Your subscription benefits will continue until the end of the current period.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <CreditCard className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Viewing Transaction History</h3>
              <p className="text-muted-foreground">
                To review your past transactions and purchases:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Billing"</li>
                <li>Click "Transaction History"</li>
                <li>View a list of all your purchases, including credits, memberships, and any other transactions</li>
                <li>Click on any transaction to view its details</li>
                <li>Use the "Download Receipt" option to save or print receipts for your records</li>
              </ol>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Security Settings</h2>
        <p className="text-muted-foreground mb-4">
          Keeping your account secure is important, especially when real prizes are involved:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Lock className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Changing Your Password</h3>
              <p className="text-muted-foreground">
                To update your password:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Security"</li>
                <li>Click "Change Password"</li>
                <li>Enter your current password</li>
                <li>Enter and confirm your new password</li>
                <li>Click "Update Password"</li>
              </ol>
              <p className="text-muted-foreground mt-2">
                <span className="text-puzzle-white font-medium">Enhanced Password Requirements:</span> Passwords must be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Avoid common sequences and repeated characters.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Shield className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Two-Factor Authentication (2FA)</h3>
              <p className="text-muted-foreground">
                Add an extra layer of security to your account by enabling 2FA:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Security"</li>
                <li>Find "Two-Factor Authentication" and click "Enable"</li>
                <li>Choose your preferred 2FA method (SMS, email, or authenticator app)</li>
                <li>Follow the setup instructions for your chosen method</li>
                <li>Save your backup codes in a secure location</li>
              </ol>
              <p className="text-muted-foreground mt-2">
                <span className="text-puzzle-white font-medium">Important:</span> We strongly recommend enabling 2FA for all accounts with active subscriptions or credit balances.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <AlertCircle className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Login History & Security Alerts</h3>
              <p className="text-muted-foreground">
                Monitor your account activity and set up security alerts:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Security"</li>
                <li>View "Login History" to see recent account access</li>
                <li>Enable "Security Alerts" to receive notifications about unusual account activity</li>
                <li>If you notice any suspicious activity, click "Secure Account" to immediately lock your account and contact support</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-puzzle-aqua/10 p-6 rounded-lg mb-8">
          <h3 className="text-puzzle-white text-xl font-bold mb-2">Security Best Practices</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>Use a unique password for your Puzzle Boss account that you don't use elsewhere</li>
            <li>Enable two-factor authentication for maximum security</li>
            <li>Never share your login credentials with anyone</li>
            <li>Be wary of phishing attempts—we will never ask for your password via email</li>
            <li>Log out when using shared or public computers</li>
          </ul>
        </div>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Notification Preferences</h2>
        <p className="text-muted-foreground mb-4">
          Control what notifications you receive and how you receive them:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Bell className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Email Notifications</h3>
              <p className="text-muted-foreground">
                To manage your email notification settings:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Notifications"</li>
                <li>Under "Email Notifications," toggle the types of emails you want to receive</li>
                <li>Options include: New puzzles, prize announcements, competition reminders, account updates, and marketing communications</li>
                <li>Click "Save Preferences" to update your settings</li>
              </ol>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Bell className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">In-App Notifications</h3>
              <p className="text-muted-foreground">
                To manage notifications within the Puzzle Boss platform:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Notifications"</li>
                <li>Under "In-App Notifications," toggle the types of notifications you want to see</li>
                <li>Options include: Competition results, friend activities, credit bonuses, and system announcements</li>
                <li>Click "Save Preferences" to update your settings</li>
              </ol>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Account Recovery Options</h2>
        <p className="text-muted-foreground mb-4">
          Set up account recovery options to ensure you never lose access to your account:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Settings className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Recovery Email</h3>
              <p className="text-muted-foreground">
                Add a recovery email to help regain access if you're locked out:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Security"</li>
                <li>Find "Recovery Options" and click "Add Recovery Email"</li>
                <li>Enter an alternate email address that you have access to</li>
                <li>Verify this email by clicking the link sent to that address</li>
              </ol>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-puzzle-aqua/20 p-2 rounded-full mt-1">
              <Settings className="h-5 w-5 text-puzzle-aqua" />
            </div>
            <div>
              <h3 className="text-puzzle-white text-xl font-bold mb-1">Recovery Phone</h3>
              <p className="text-muted-foreground">
                Add a recovery phone number for SMS verification:
              </p>
              <ol className="pl-5 mt-2 text-muted-foreground">
                <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Security"</li>
                <li>Find "Recovery Options" and click "Add Recovery Phone"</li>
                <li>Enter your phone number</li>
                <li>Enter the verification code sent to your phone</li>
              </ol>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Account Deletion</h2>
        <p className="text-muted-foreground mb-4">
          If you need to close your account permanently:
        </p>
        
        <div className="bg-puzzle-black/30 border border-red-500/30 p-6 rounded-lg mb-8">
          <h3 className="text-red-400 text-xl font-bold mb-2">Important: Account Deletion is Permanent</h3>
          <p className="text-muted-foreground mb-4">
            Deleting your account will:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>Permanently remove all your profile information</li>
            <li>Forfeit any unused credits or active subscriptions</li>
            <li>Remove you from all leaderboards and competitions</li>
            <li>Delete your puzzle history and achievements</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            This action cannot be undone. If you're having issues with the platform, please <Link to="/contact" className="text-puzzle-aqua hover:underline">contact support</Link> first to see if we can help resolve them.
          </p>
          <div className="mt-4">
            <p className="text-muted-foreground">
              To delete your account:
            </p>
            <ol className="pl-5 mt-2 text-muted-foreground">
              <li>Go to <Link to="/settings" className="text-puzzle-aqua hover:underline">Account Settings</Link> {">"} "Account"</li>
              <li>Scroll to the bottom and click "Delete Account"</li>
              <li>Follow the verification steps (which may include entering your password or a special code)</li>
              <li>Confirm your decision</li>
            </ol>
          </div>
        </div>

        <h2 className="text-puzzle-white text-2xl font-bold mb-4">Interactive Example: Account Settings Navigation</h2>
        <p className="text-muted-foreground mb-4">
          Try this simple interactive puzzle to familiarize yourself with navigating account settings:
        </p>
        
        <div className="bg-puzzle-black/30 border-puzzle-aqua/20 border p-6 rounded-lg mb-8">
          <p className="text-muted-foreground mb-4">
            In this example, rearrange the tiles to create the correct navigation path to change your password:
          </p>
          <div className="max-w-sm mx-auto">
          <EnhancedJigsawPuzzle 
            imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            rows={3}
            columns={3}
            showNumbers={true}
          />
          </div>
          <p className="text-muted-foreground mt-4 text-center">
            The correct path is: Settings {">"} Security {">"} Change Password {">"} Save
          </p>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Link to="/guides/prize-claim-process" className="text-puzzle-aqua hover:underline flex items-center">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Prize Claim Process
          </Link>
          <Link to="/guides/getting-started-guide" className="text-puzzle-aqua hover:underline flex items-center">
            Getting Started Guide
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountManagement;
