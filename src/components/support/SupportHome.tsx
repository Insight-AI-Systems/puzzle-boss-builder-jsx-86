
import React from 'react';
import { Button } from '@/components/ui/button';
import { SupportFAQ } from './SupportFAQ';
import { SupportContact } from './SupportContact';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { migrateKnownIssuesToSupport } from '@/utils/issueMigration';
import { DatabaseZap } from 'lucide-react';

export const SupportHome = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleMigration = async () => {
    if (!user) return;
    
    toast({
      title: "Migration Started",
      description: "Migrating known issues to the support system...",
    });

    const success = await migrateKnownIssuesToSupport(user.id);
    
    if (success) {
      toast({
        title: "Migration Complete",
        description: "All known issues have been migrated to the support system.",
      });
    } else {
      toast({
        title: "Migration Failed",
        description: "There was an error migrating the issues. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {isAdmin && (
        <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Admin Migration Tool</h3>
              <p className="text-muted-foreground">
                Migrate known issues to the new support ticket system
              </p>
            </div>
            <Button 
              onClick={handleMigration}
              className="flex items-center gap-2"
            >
              <DatabaseZap className="h-4 w-4" />
              Migrate Issues
            </Button>
          </div>
        </div>
      )}
      
      <SupportFAQ />
      <SupportContact />
    </div>
  );
};
