
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';
import { DateRangeSelector } from '../DateRangeSelector';
import { ActivityBreakdownCard } from '../ActivityBreakdownCard';
import { useAnalytics } from '@/hooks/admin/useAnalytics';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { 
    dailyMetrics, 
    monthlyTrends, 
    categoryRevenue, 
    activityBreakdown,
    isLoadingDailyMetrics,
    isLoadingMonthlyTrends,
    isLoadingCategoryRevenue,
    dateRange,
    setDateRange,
    getUserTrend,
    getSignupTrend,
    getPuzzlesTrend,
    getRevenueTrend
  } = useAnalytics();
  
  const isLoading = isLoadingDailyMetrics || isLoadingMonthlyTrends || isLoadingCategoryRevenue;

  if (isLoading) {
    return (
      <TabsContent value="overview" className="space-y-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="overview" className="space-y-6">
      <DateRangeSelector 
        dateRange={dateRange}
        onDateChange={setDateRange}
      />
      
      <ActivityBreakdownCard data={activityBreakdown} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Users" 
          value={dailyMetrics?.active_users || 0}
          trend={getUserTrend()}
          subtext="vs. last month"
        />
        <StatCard 
          title="New Signups" 
          value={dailyMetrics?.new_signups || 0}
          trend={getSignupTrend()}
          subtext="vs. last month"
        />
        <StatCard 
          title="Puzzles Completed" 
          value={dailyMetrics?.puzzles_completed || 0}
          trend={getPuzzlesTrend()}
          subtext="vs. last month"
        />
        <StatCard 
          title="Revenue" 
          value={`$${dailyMetrics?.revenue || 0}`}
          trend={getRevenueTrend()}
          subtext="vs. last month"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {categoryRevenue && categoryRevenue.length > 0 ? (
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category_name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total_revenue" fill="#0077B6" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <ChartPlaceholder 
                  title="Revenue by Category" 
                  description="No category revenue data available"
                  type="bar"
                  height="h-full"
                />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {monthlyTrends && monthlyTrends.length > 0 ? (
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month_date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active_users" fill="#0077B6" name="Active Users" />
                      <Bar dataKey="new_signups" fill="#00B4D8" name="New Signups" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <ChartPlaceholder 
                  title="User Activity" 
                  description="No monthly activity data available"
                  type="line"
                  height="h-full"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
