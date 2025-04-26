
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';
import { useAnalytics } from '@/hooks/admin/useAnalytics';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const OverviewTab: React.FC = () => {
  const { dailyMetrics, monthlyTrends, categoryRevenue } = useAnalytics();

  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Users" 
          value={dailyMetrics?.active_users || 0}
          trend={{ 
            value: monthlyTrends?.[0]?.active_users > monthlyTrends?.[1]?.active_users ? "12%" : "-8%",
            direction: monthlyTrends?.[0]?.active_users > monthlyTrends?.[1]?.active_users ? "up" : "down"
          }}
          subtext="vs. last month"
        />
        <StatCard 
          title="New Signups" 
          value={dailyMetrics?.new_signups || 0}
          trend={{ 
            value: monthlyTrends?.[0]?.new_signups > monthlyTrends?.[1]?.new_signups ? "18%" : "-5%",
            direction: monthlyTrends?.[0]?.new_signups > monthlyTrends?.[1]?.new_signups ? "up" : "down"
          }}
          subtext="vs. last month"
        />
        <StatCard 
          title="Puzzles Completed" 
          value={dailyMetrics?.puzzles_completed || 0}
          trend={{ 
            value: monthlyTrends?.[0]?.puzzles_completed > monthlyTrends?.[1]?.puzzles_completed ? "24%" : "-3%",
            direction: monthlyTrends?.[0]?.puzzles_completed > monthlyTrends?.[1]?.puzzles_completed ? "up" : "down"
          }}
          subtext="vs. last month"
        />
        <StatCard 
          title="Revenue" 
          value={`$${dailyMetrics?.revenue || 0}`}
          trend={{ 
            value: monthlyTrends?.[0]?.revenue > monthlyTrends?.[1]?.revenue ? "15%" : "-8%",
            direction: monthlyTrends?.[0]?.revenue > monthlyTrends?.[1]?.revenue ? "up" : "down"
          }}
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
              {categoryRevenue ? (
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
                  description="Top 5 categories by revenue"
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
              {monthlyTrends ? (
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
                  description="Monthly active users and signups"
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
