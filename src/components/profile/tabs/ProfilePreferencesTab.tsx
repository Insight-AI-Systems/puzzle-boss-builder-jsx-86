
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings, Palette, Volume2 } from 'lucide-react';

interface ProfilePreferencesTabProps {
  profile: any;
  updateProfile: (data: any) => Promise<any>;
}

export const ProfilePreferencesTab: React.FC<ProfilePreferencesTabProps> = ({ 
  profile, 
  updateProfile 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Game Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Difficulty Preference</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Timer Display</Label>
            <Select defaultValue="always">
              <SelectTrigger>
                <SelectValue placeholder="Select timer preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always Show</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
                <SelectItem value="never">Never Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span>Auto-save Progress</span>
            <Badge variant="default">Enabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Theme</Label>
            <Select defaultValue="dark">
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span>Animations</span>
            <Badge variant="default">Enabled</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>High Contrast Mode</span>
            <Badge variant="secondary">Disabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Sound Effects</span>
            <Badge variant="default">Enabled</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Background Music</span>
            <Badge variant="secondary">Disabled</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Voice Announcements</span>
            <Badge variant="secondary">Disabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full">
        Save Preferences
      </Button>
    </div>
  );
};
