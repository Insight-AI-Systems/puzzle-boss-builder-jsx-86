
import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PrivacySection = () => {
  const { toast } = useToast();
  const [privacySettings, setPrivacySettings] = useState({
    showUsername: true,
    allowRankingDisplay: true,
    showActivityStatus: true
  });
  
  const handleTogglePrivacy = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
    
    toast({
      title: "Privacy setting updated",
      description: "Your privacy settings have been updated"
    });
  };
  
  return (
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
                    onChange={() => handleTogglePrivacy(key)} 
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
  );
};

export default PrivacySection;
