
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import CFOSidebar from "@/components/cfo/CFOSidebar";
import FinancialOverview from "@/components/cfo/FinancialOverview";
import IncomeStreams from "@/components/cfo/IncomeStreams";
import CostStreams from "@/components/cfo/CostStreams";
import CommissionsManagement from "@/components/cfo/CommissionsManagement";
import MembershipSummary from "@/components/cfo/MembershipSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CFODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-puzzle-black">
        <CFOSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-game text-puzzle-gold mb-6">CFO Dashboard</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="commissions">Commissions</TabsTrigger>
                <TabsTrigger value="membership">Membership</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <FinancialOverview />
              </TabsContent>
              
              <TabsContent value="income">
                <IncomeStreams />
              </TabsContent>
              
              <TabsContent value="expenses">
                <CostStreams />
              </TabsContent>
              
              <TabsContent value="commissions">
                <CommissionsManagement />
              </TabsContent>
              
              <TabsContent value="membership">
                <MembershipSummary />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default CFODashboard;
