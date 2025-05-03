
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { StatCard } from '../StatCard';
import { ChartPlaceholder } from '../ChartPlaceholder';
import { useAnalytics } from '@/hooks/admin/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const UsersTab: React.FC = () => {
  const { 
    userDemographics, 
    isLoadingUserDemographics,
    dailyMetrics,
    isLoadingDailyMetrics
  } = useAnalytics();

  if (isLoadingUserDemographics || isLoadingDailyMetrics) {
    return (
      <TabsContent value="users" className="space-y-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
        </div>
      </TabsContent>
    );
  }

  // Transform gender data for chart
  const genderData = userDemographics?.gender_distribution
    ? Object.entries(userDemographics.gender_distribution)
        .filter(([name]) => name !== 'null' && name !== 'Not Specified')
        .map(([name, value]) => ({
          name: name === 'null' ? 'Not Specified' : name,
          value
        }))
    : [];

  // Add a "Not Specified" entry if relevant
  const notSpecifiedCount = 
    (userDemographics?.gender_distribution?.['null'] || 0) + 
    (userDemographics?.gender_distribution?.['Not Specified'] || 0);
  
  if (notSpecifiedCount > 0 && genderData.length > 0) {
    genderData.push({
      name: 'Not Specified',
      value: notSpecifiedCount
    });
  }

  // Transform age data for chart
  const ageData = userDemographics?.age_distribution
    ? Object.entries(userDemographics.age_distribution)
        .filter(([name]) => name !== 'null' && name !== 'Not Specified')
        .map(([name, value]) => ({
          name,
          value
        }))
    : [];
  
  // Add a "Not Specified" entry for age if relevant
  const notSpecifiedAgeCount = 
    (userDemographics?.age_distribution?.['null'] || 0) + 
    (userDemographics?.age_distribution?.['Not Specified'] || 0);
  
  if (notSpecifiedAgeCount > 0 && ageData.length > 0) {
    ageData.push({
      name: 'Not Specified',
      value: notSpecifiedAgeCount
    });
  }

  // Calculate totals for metrics, preferring userDemographics for total_users
  // This ensures we have a consistent source of truth
  const totalUsers = userDemographics?.total_users || dailyMetrics?.total_users || 0;
  const activePlayers = dailyMetrics?.active_users || 0;
  
  console.log("User metrics:", {
    totalUsers,
    activePlayers,
    fromUserDemographics: userDemographics?.total_users,
    fromDailyMetrics: dailyMetrics?.total_users
  });
  
  // Ensure conversion rate calculation uses the correct denominator
  const conversionRate = totalUsers > 0 
    ? (((dailyMetrics?.puzzles_completed || 0) / totalUsers) * 100).toFixed(1) 
    : "0.0";
  
  // Ensure retention rate is properly calculated with a non-zero denominator
  const retentionRate = totalUsers > 0 
    ? ((activePlayers / totalUsers) * 100).toFixed(1) 
    : "0.0";

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <TabsContent value="users" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={totalUsers} 
        />
        <StatCard 
          title="Active Players" 
          value={activePlayers} 
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${conversionRate}%`} 
        />
        <StatCard 
          title="Retention Rate" 
          value={`${retentionRate}%`} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {genderData.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        ) : (
          <ChartPlaceholder 
            title="Gender Distribution" 
            description="No gender data available"
            type="pie"
          />
        )}

        {ageData.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        ) : (
          <ChartPlaceholder 
            title="Age Distribution" 
            description="No age group data available"
            type="pie"
          />
        )}
      </div>
    </TabsContent>
  );
};
