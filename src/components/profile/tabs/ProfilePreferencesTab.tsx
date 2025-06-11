
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberDetailedProfile } from '@/types/memberTypes';
import { UseMutationResult } from '@tanstack/react-query';
import { Bell, Mail, MessageSquare, Shield, Eye, Download } from "lucide-react";

interface ProfilePreferencesTabProps {
  profile: MemberDetailedProfile;
  updateProfile: UseMutationResult<any, Error, Partial<MemberDetailedProfile>, unknown>;
}

export function ProfilePreferencesTab({ profile, updateProfile }: ProfilePreferencesTabProps) {
  const [preferences, setPreferences] = React.useState({
    emailNotifications: profile.marketing_opt_in || false,
    smsNotifications: false,
    pushNotifications: true,
    gameUpdates: true,
    prizeNotifications: true,
    newsletterSubscription: profile.marketing_opt_in || false,
    marketingEmails: profile.marketing_opt_in || false,
    emailFrequency: 'weekly',
    profileVisibility: 'public',
    showWinnings: true,
    showGameHistory: true,
    dataCollection: true,
  });

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));

    // Update marketing opt-in when relevant preferences change
    if (key === 'emailNotifications' || key === 'newsletterSubscription' || key === 'marketingEmails') {
      updateProfile.mutate({
        marketing_opt_in: value as boolean
      });
    }
  };

  const exportData = () => {
    // This would trigger a data export request
    console.log('Exporting user data...');
  };

  return (
    <div className="space-y-6">
      {/* Communication Preferences */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-puzzle-aqua" />
            Communication Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-puzzle-white font-medium">Email Notifications</p>
                <p className="text-puzzle-white/60 text-sm">Receive general notifications via email</p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-puzzle-white font-medium">SMS Notifications</p>
                <p className="text-puzzle-white/60 text-sm">Receive important updates via SMS</p>
              </div>
              <Switch
                checked={preferences.smsNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-puzzle-white font-medium">Push Notifications</p>
                <p className="text-puzzle-white/60 text-sm">Receive browser push notifications</p>
              </div>
              <Switch
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-puzzle-white font-medium">Game Updates</p>
                <p className="text-puzzle-white/60 text-sm">New puzzles and game announcements</p>
              </div>
              <Switch
                checked={preferences.gameUpdates}
                onCheckedChange={(checked) => handlePreferenceChange('gameUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-puzzle-white font-medium">Prize Notifications</p>
                <p className="text-puzzle-white/60 text-sm">Notifications about winnings and prizes</p>
              </div>
              <Switch
                checked={preferences.prizeNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('prizeNotifications', checked)}
              />
            </div>
          </div>

          <div className="border-t border-puzzle-aqua/20 pt-4">
            <div className="space-y-4">
              <div>
                <label className="text-puzzle-white font-medium mb-2 block">Email Frequency</label>
                <Select 
                  value={preferences.emailFrequency} 
                  onValueChange={(value) => handlePreferenceChange('emailFrequency', value)}
                >
                  <SelectTrigger className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-puzzle-black border-puzzle-aqua/30">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Preferences */}
      <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-puzzle-gold" />
            Marketing Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-puzzle-white font-medium">Newsletter Subscription</p>
              <p className="text-puzzle-white/60 text-sm">Receive our weekly newsletter</p>
            </div>
            <Switch
              checked={preferences.newsletterSubscription}
              onCheckedChange={(checked) => handlePreferenceChange('newsletterSubscription', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-puzzle-white font-medium">Marketing Emails</p>
              <p className="text-puzzle-white/60 text-sm">Special offers and promotions</p>
            </div>
            <Switch
              checked={preferences.marketingEmails}
              onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-puzzle-black/50 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-400" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-puzzle-white font-medium mb-2 block">Profile Visibility</label>
            <Select 
              value={preferences.profileVisibility} 
              onValueChange={(value) => handlePreferenceChange('profileVisibility', value)}
            >
              <SelectTrigger className="bg-puzzle-black border-red-500/30 text-puzzle-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-puzzle-black border-red-500/30">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-puzzle-white font-medium">Show Winnings</p>
              <p className="text-puzzle-white/60 text-sm">Display your prize winnings publicly</p>
            </div>
            <Switch
              checked={preferences.showWinnings}
              onCheckedChange={(checked) => handlePreferenceChange('showWinnings', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-puzzle-white font-medium">Show Game History</p>
              <p className="text-puzzle-white/60 text-sm">Display your game completion history</p>
            </div>
            <Switch
              checked={preferences.showGameHistory}
              onCheckedChange={(checked) => handlePreferenceChange('showGameHistory', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-puzzle-white font-medium">Data Collection</p>
              <p className="text-puzzle-white/60 text-sm">Allow analytics and usage data collection</p>
            </div>
            <Switch
              checked={preferences.dataCollection}
              onCheckedChange={(checked) => handlePreferenceChange('dataCollection', checked)}
            />
          </div>

          <div className="border-t border-red-500/20 pt-4">
            <Button 
              onClick={exportData}
              variant="outline" 
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Export My Data (GDPR)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
