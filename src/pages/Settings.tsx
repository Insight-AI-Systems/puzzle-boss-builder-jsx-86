import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Shield, Bell } from 'lucide-react';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { useClerkAuth } from '@/hooks/useClerkAuth';

const Settings = () => {
  const { user } = useClerkAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          <SecuritySettings />
          
          {/* Additional settings sections can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
