
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MonthlyFinancialSummary } from '@/types/financeTypes';

interface FinancialTabContentProps {
  financialData: MonthlyFinancialSummary | null;
  selectedMonth: string;
}

export const FinancialTabContent: React.FC<FinancialTabContentProps> = ({
  financialData,
  selectedMonth,
}) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Summary</CardTitle>
            <CardDescription>Key financial metrics for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {financialData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Commissions Paid</h4>
                    <p className="text-lg">${financialData.commissions_paid.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Prize Expenses</h4>
                    <p className="text-lg">${financialData.prize_expenses.toFixed(2)}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    For more detailed financial information, visit the 
                    <Button variant="link" className="h-auto p-0 ml-1" asChild>
                      <a href="/cfo-dashboard">Full CFO Dashboard</a>
                    </Button>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No financial data available for this period.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="commissions" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commission Summary</CardTitle>
            <CardDescription>Current commission status and amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm font-medium">Commissions for {format(new Date(`${selectedMonth}-01`), 'MMMM yyyy')}</p>
              <p className="text-sm">
                To view and manage detailed commission information, please visit the 
                <Button variant="link" className="h-auto p-0 mx-1" asChild>
                  <a href="/cfo-dashboard/commissions">Commission Management</a>
                </Button>
                page.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="expenses" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Summary</CardTitle>
            <CardDescription>Expense breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm font-medium">Expenses for {format(new Date(`${selectedMonth}-01`), 'MMMM yyyy')}</p>
              <p className="text-sm">
                For a detailed breakdown of expenses, please visit the 
                <Button variant="link" className="h-auto p-0 mx-1" asChild>
                  <a href="/cfo-dashboard/expenses">Cost Streams</a>
                </Button>
                page.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};
