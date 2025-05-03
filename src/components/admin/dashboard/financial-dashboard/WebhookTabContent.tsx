
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import XeroWebhookManager from '@/components/finance/XeroWebhookManager';

interface WebhookTabContentProps {
  activeTab: string;
}

export const WebhookTabContent: React.FC<WebhookTabContentProps> = ({ activeTab }) => {
  return (
    <TabsContent value="webhooks">
      <XeroWebhookManager />
    </TabsContent>
  );
};
