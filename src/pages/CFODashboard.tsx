
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import CFOSidebar from "@/components/cfo/CFOSidebar";
import FinancialOverview from "@/components/cfo/FinancialOverview";
import IncomeStreams from "@/components/cfo/IncomeStreams";
import CostStreams from "@/components/cfo/CostStreams";
import CommissionsManagement from "@/components/cfo/CommissionsManagement";
import MembershipSummary from "@/components/cfo/MembershipSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { TimeFrame } from "@/types/financeTypes";

const CFODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedMonth, setSelectedMonth] = React.useState(format(new Date(), 'yyyy-MM'));
  const timeframe: TimeFrame = "monthly";

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-puzzle-black">
        {/* We're passing no props since the component doesn't accept them according to the error */}
        <CFOSidebar />
        
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
                <FinancialOverview timeframe={timeframe} />
              </TabsContent>
              
              <TabsContent value="income">
                <IncomeStreams selectedMonth={selectedMonth} />
              </TabsContent>
              
              <TabsContent value="expenses">
                <CostStreams selectedMonth={selectedMonth} />
              </TabsContent>
              
              <TabsContent value="commissions">
                <CommissionsManagement selectedMonth={selectedMonth} />
              </TabsContent>
              
              <TabsContent value="membership">
                <MembershipSummary selectedMonth={selectedMonth} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default CFODashboard;
