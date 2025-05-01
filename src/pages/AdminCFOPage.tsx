
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialOverview from "@/components/cfo/FinancialOverview";
import IncomeStreams from "@/components/cfo/IncomeStreams";
import CostStreams from "@/components/cfo/CostStreams";
import CommissionsManagement from "@/components/cfo/CommissionsManagement";
import MembershipSummary from "@/components/cfo/MembershipSummary";
import { format } from "date-fns";
import { TimeFrame } from "@/types/financeTypes";

const AdminCFOPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const timeframe: TimeFrame = "monthly";

  return (
    <AdminLayout>
      <div>
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
    </AdminLayout>
  );
};

export default AdminCFOPage;
