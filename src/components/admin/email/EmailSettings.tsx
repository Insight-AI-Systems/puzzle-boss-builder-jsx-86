
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

const Label: React.FC<LabelProps> = ({ children, htmlFor }) => (
  <label 
    htmlFor={htmlFor} 
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);

export const EmailSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Provider Settings</CardTitle>
          <CardDescription>Configure your email delivery service settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email_provider">Email Service Provider</Label>
              <Select defaultValue="custom_smtp" id="email_provider">
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom_smtp">Custom SMTP</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="aws_ses">AWS SES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_email">From Email Address</Label>
              <Input id="from_email" placeholder="noreply@puzzleboss.com" defaultValue="noreply@puzzleboss.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_name">From Name</Label>
              <Input id="from_name" placeholder="Puzzle Boss" defaultValue="Puzzle Boss" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply_to">Reply-To Email</Label>
              <Input id="reply_to" placeholder="support@puzzleboss.com" defaultValue="support@puzzleboss.com" />
            </div>
          </div>
          <div className="pt-4">
            <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure when system emails are sent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="welcome" defaultChecked />
              <div className="space-y-1 leading-none">
                <Label htmlFor="welcome">Welcome Email</Label>
                <p className="text-sm text-muted-foreground">
                  Send a welcome email when a new user signs up
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="verification" defaultChecked />
              <div className="space-y-1 leading-none">
                <Label htmlFor="verification">Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require email verification for new accounts
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="prize_win" defaultChecked />
              <div className="space-y-1 leading-none">
                <Label htmlFor="prize_win">Prize Win Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications when a user wins a prize
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="new_puzzle" defaultChecked />
              <div className="space-y-1 leading-none">
                <Label htmlFor="new_puzzle">New Puzzle Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify users when new puzzles are available in their favorite categories
                </p>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

