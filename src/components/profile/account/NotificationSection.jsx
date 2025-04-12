
import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotificationSection = () => {
  const { toast } = useToast();
  const [emailPrefs, setEmailPrefs] = useState({
    puzzleAlerts: true,
    winningNotifications: true,
    specialOffers: false,
    weeklyNewsletter: true
  });
  
  const handleToggleNotification = (setting) => {
    setEmailPrefs({
      ...emailPrefs,
      [setting]: !emailPrefs[setting]
    });
    
    toast({
      title: "Preference updated",
      description: "Your email notification preferences have been saved"
    });
  };
  
  return (
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
                    onChange={() => handleToggleNotification(key)} 
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

export default NotificationSection;
