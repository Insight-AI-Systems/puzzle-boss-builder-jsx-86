
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from 'lucide-react';
import EmailSection from './EmailSection';
import PasswordSection from './PasswordSection';
import NotificationSection from './NotificationSection';
import PrivacySection from './PrivacySection';
import DeactivateSection from './DeactivateSection';
import { Accordion } from "@/components/ui/accordion";

/**
 * Component that displays account settings organized into sections
 */
const AccountSettings = ({ user, profile, onSignOut }) => {
  const [loading, setLoading] = useState(false);
  
  // Share state and handlers with child components
  const settingsProps = {
    user,
    profile,
    loading,
    setLoading,
    onSignOut
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
          <EmailSection {...settingsProps} />
          <PasswordSection {...settingsProps} />
          <NotificationSection {...settingsProps} />
          <PrivacySection {...settingsProps} />
          <DeactivateSection {...settingsProps} />
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
