
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CampaignList } from "./CampaignList";
import { CampaignDialog } from "./CampaignDialog";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEmailCampaigns } from "@/hooks/admin/useEmailCampaigns";
import { Loader2 } from "lucide-react";
import { EmailCampaign } from "./types";

export const EmailCampaigns: React.FC = () => {
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const { toast } = useToast();
  const { 
    campaigns,
    isLoading,
    error,
    createCampaign,
    refreshCampaigns 
  } = useEmailCampaigns();

  const handleCreateCampaign = async (data: Omit<EmailCampaign, 'id' | 'created_at' | 'sent' | 'opened'>) => {
    try {
      await createCampaign(data);
      setIsCampaignDialogOpen(false);
      toast({
        title: "Campaign created",
        description: "Email campaign has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Email Campaigns</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={refreshCampaigns} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button onClick={() => setIsCampaignDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error instanceof Error ? error.message : "An error occurred while loading campaigns"}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <CampaignList campaigns={campaigns} />
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No email campaigns found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsCampaignDialogOpen(true)}
          >
            Create your first campaign
          </Button>
        </div>
      )}

      <CampaignDialog
        open={isCampaignDialogOpen}
        onOpenChange={setIsCampaignDialogOpen}
        onSubmit={handleCreateCampaign}
      />
    </div>
  );
};
