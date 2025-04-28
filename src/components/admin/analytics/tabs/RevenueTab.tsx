
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';
import { useAnalytics } from '@/hooks/admin/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const RevenueTab: React.FC = () => {
  const { 
    revenueMetrics, 
    isLoadingRevenueMetrics 
  } = useAnalytics();

  if (isLoadingRevenueMetrics) {
    return (
      <TabsContent value="revenue" className="space-y-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
        </div>
      </TabsContent>
    );
  }

  // Format revenue as currency
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  }

  // Prepare revenue by type chart data
  const revenueChartData = revenueMetrics?.revenue_by_type
    ? Object.entries(revenueMetrics.revenue_by_type).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }))
    : [];

  return (
    <TabsContent value="revenue" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(revenueMetrics?.total_revenue || 0)} 
          subtext="Year to date"
        />
        <StatCard 
          title="Avg. Revenue Per User" 
          value={formatCurrency(revenueMetrics?.avg_revenue_per_user || 0)} 
          subtext="Year to date"
        />
        <StatCard 
          title="Credit Purchases" 
          value={revenueMetrics?.credit_purchases || 0} 
          subtext="Year to date"
        />
      </div>

      {revenueChartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${parseFloat(value as any).toFixed(2)}`, 'Revenue']} />
                  <Legend />
                  <Bar dataKey="value" fill="#0077B6" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <ChartPlaceholder 
          title="Revenue Breakdown" 
          description="No revenue data available by category"
          type="bar"
        />
      )}
    </TabsContent>
  );
};
