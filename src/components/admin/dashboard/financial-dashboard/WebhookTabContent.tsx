
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import XeroWebhookManager from '@/components/finance/XeroWebhookManager';

export const WebhookTabContent: React.FC = () => {
  return (
    <TabsContent value="webhooks">
      <XeroWebhookManager />
    </TabsContent>
  );
};
