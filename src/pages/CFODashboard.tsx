
import React from "react";
import { MainLayout } from "@/components/MainLayout";
import { FinanceDashboard } from "@/components/finance/FinanceDashboard";
import { FinanceProvider } from "@/contexts/FinanceContext";

const CFODashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-puzzle-black">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-game text-puzzle-gold mb-6">CFO Dashboard</h1>
            
            <FinanceProvider>
              <FinanceDashboard />
            </FinanceProvider>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default CFODashboard;
