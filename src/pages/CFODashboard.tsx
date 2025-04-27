
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useFinancials } from '@/hooks/useFinancials';
import { MonthlyFinancialSummary } from '@/types/financeTypes';
import { format } from 'date-fns';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import PageLayout from '@/components/layouts/PageLayout';

const CFODashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [financialSummary, setFinancialSummary] = useState<MonthlyFinancialSummary | null>(null);
  const { fetchMonthlyFinancialSummary, isLoading } = useFinancials();

  useEffect(() => {
    const loadFinancialSummary = async () => {
      const summary = await fetchMonthlyFinancialSummary(selectedMonth);
      setFinancialSummary(summary);
    };

    loadFinancialSummary();
  }, [selectedMonth]);

  return (
    <ProtectedRoute requiredRoles={['cfo', 'super_admin']}>
      <PageLayout 
        title="CFO Financial Dashboard" 
        subtitle="Comprehensive Financial Insights"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Select 
              value={selectedMonth} 
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {/* Generate month selection options */}
                {Array.from({ length: 12 }, (_, i) => {
                  const monthDate = new Date(new Date().getFullYear(), i, 1);
                  return (
                    <SelectItem 
                      key={format(monthDate, 'yyyy-MM')} 
                      value={format(monthDate, 'yyyy-MM')}
                    >
                      {format(monthDate, 'MMMM yyyy')}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div>Loading financial data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  ${financialSummary?.total_income.toFixed(2) || '0.00'}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  ${financialSummary?.total_expenses.toFixed(2) || '0.00'}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  ${financialSummary?.net_profit.toFixed(2) || '0.00'}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commissions Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  ${financialSummary?.commissions_paid.toFixed(2) || '0.00'}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prize Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  ${financialSummary?.prize_expenses.toFixed(2) || '0.00'}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default CFODashboard;
