
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import XeroIntegration from '@/components/finance/XeroIntegration';

export const XeroTabContent: React.FC = () => {
  return (
    <TabsContent value="xero">
      <XeroIntegration />
    </TabsContent>
  );
};
