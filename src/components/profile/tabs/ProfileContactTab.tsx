
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MessageSquare } from 'lucide-react';

interface ProfileContactTabProps {
  profile: any;
  updateProfile: (data: any) => Promise<any>;
  isAdmin?: boolean;
}

export const ProfileContactTab: React.FC<ProfileContactTabProps> = ({ 
  profile, 
  updateProfile,
  isAdmin = false 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={profile?.phone || ''}
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Email Verified</span>
            <Badge variant="default">Verified</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Phone Verified</span>
            <Badge variant="secondary">Not Verified</Badge>
          </div>

          <Button className="w-full">
            Update Contact Information
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>SMS Notifications</span>
            <Badge variant="secondary">Disabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Marketing Communications</span>
            <Badge variant="secondary">Opted Out</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
