
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FinanceTabContent } from './FinanceTabContent';
import { XeroTabContent } from './XeroTabContent';
import { WebhookTabContent } from './WebhookTabContent';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedMonth: string;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeTab,
  setActiveTab,
  selectedMonth 
}) => {
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="commissions">Commissions</TabsTrigger>
        <TabsTrigger value="membership">Membership</TabsTrigger>
        <TabsTrigger value="xero">Xero Integration</TabsTrigger>
        <TabsTrigger value="webhooks">Xero Webhooks</TabsTrigger>
      </TabsList>
      
      <FinanceTabContent 
        activeTab={activeTab}
        selectedMonth={selectedMonth} 
      />
      
      <TabsContent value="xero">
        <XeroTabContent />
      </TabsContent>
      
      <TabsContent value="webhooks">
        <WebhookTabContent />
      </TabsContent>
    </Tabs>
  );
};
