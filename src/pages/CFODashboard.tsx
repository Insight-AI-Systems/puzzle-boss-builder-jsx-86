
import React, { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { FinanceDashboard } from "@/components/finance/FinanceDashboard";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Fixed import to use default export instead of named export
import XeroIntegration from "@/components/finance/XeroIntegration";

const CFODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <MainLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-puzzle-black">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-game text-puzzle-gold mb-6">CFO Dashboard</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="dashboard">Financial Dashboard</TabsTrigger>
                <TabsTrigger value="xero">Xero Integration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <FinanceProvider>
                  <FinanceDashboard />
                </FinanceProvider>
              </TabsContent>
              
              <TabsContent value="xero">
                <XeroIntegration />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default CFODashboard;
