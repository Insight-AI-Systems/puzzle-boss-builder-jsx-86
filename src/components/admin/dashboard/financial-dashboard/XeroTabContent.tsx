
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import XeroIntegration from '@/components/finance/XeroIntegration';

interface XeroTabContentProps {
  activeTab: string;
}

export const XeroTabContent: React.FC<XeroTabContentProps> = ({ activeTab }) => {
  return (
    <TabsContent value="xero">
      <XeroIntegration />
    </TabsContent>
  );
};
