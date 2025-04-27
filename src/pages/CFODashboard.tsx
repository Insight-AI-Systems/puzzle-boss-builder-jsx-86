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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useFinancials } from '@/hooks/useFinancials';
import { MonthlyFinancialSummary, TimeFrame } from '@/types/financeTypes';
import { format } from 'date-fns';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import PageLayout from '@/components/layouts/PageLayout';
import { useNavigate } from 'react-router-dom';
import FinancialOverview from '@/components/cfo/FinancialOverview';
import IncomeStreams from '@/components/cfo/IncomeStreams';
import CostStreams from '@/components/cfo/CostStreams';
import MembershipSummary from '@/components/cfo/MembershipSummary';
import CommissionsManagement from '@/components/cfo/CommissionsManagement';
import { BarChart, DownloadIcon, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const CFODashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [activeTab, setActiveTab] = useState('overview');
  const [financialSummary, setFinancialSummary] = useState<MonthlyFinancialSummary | null>(null);
  const [financialTrends, setFinancialTrends] = useState<MonthlyFinancialSummary[]>([]);
  const { fetchMonthlyFinancialSummary, fetchFinancialTrends, isLoading } = useFinancials();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFinancialSummary = async () => {
      const summary = await fetchMonthlyFinancialSummary(selectedMonth);
      setFinancialSummary(summary);
    };

    const loadFinancialTrends = async () => {
      const trends = await fetchFinancialTrends(6);
      setFinancialTrends(trends);
    };

    loadFinancialSummary();
    loadFinancialTrends();
  }, [selectedMonth]);

  return (
    <ProtectedRoute requiredRoles={['cfo', 'super_admin']}>
      <PageLayout 
        title="Financial Management Portal" 
        subtitle="Comprehensive financial insights and management tools"
      >
        <div className="space-y-6">
          {/* Top Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
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
              
              <Button variant="outline" className="flex items-center gap-2">
                <DownloadIcon className="h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          {/* Financial Summary Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-muted h-32 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    <div className="text-2xl font-bold text-green-500">
                      ${financialSummary?.total_income.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-red-500" />
                    <div className="text-2xl font-bold text-red-500">
                      ${financialSummary?.total_expenses.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    {(financialSummary?.net_profit || 0) >= 0 ? (
                      <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    <div className={`text-2xl font-bold ${(financialSummary?.net_profit || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${Math.abs(financialSummary?.net_profit || 0).toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Prize Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart className="mr-2 h-4 w-4 text-orange-500" />
                    <div className="text-2xl font-bold text-orange-500">
                      ${financialSummary?.prize_expenses.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs for different financial sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <FinancialOverview trends={financialTrends} />
            </TabsContent>
            
            <TabsContent value="income">
              <IncomeStreams selectedMonth={selectedMonth} />
            </TabsContent>
            
            <TabsContent value="expenses">
              <CostStreams selectedMonth={selectedMonth} />
            </TabsContent>
            
            <TabsContent value="membership">
              <MembershipSummary selectedMonth={selectedMonth} />
            </TabsContent>
            
            <TabsContent value="commissions">
              <CommissionsManagement selectedMonth={selectedMonth} />
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default CFODashboard;
