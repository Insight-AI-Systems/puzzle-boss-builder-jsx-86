
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { UserStats } from '@/types/adminTypes';
import { Loader2 } from 'lucide-react';

interface UserInsightsDashboardProps {
  userStats: UserStats | null;
  signupStats: Array<{ month: string; count: number }>;
}

export function UserInsightsDashboard({ userStats, signupStats }: UserInsightsDashboardProps) {
  if (!userStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Insights</CardTitle>
          <CardDescription>Loading user statistics...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Process gender data for the chart
  const genderData = Object.entries(userStats.genderBreakdown || {})
    .map(([key, value]) => ({
      name: key === 'Unknown' && value === 0 ? 'No Data' : key,
      value: value
    }));

  // Format signup stats for display
  const formattedSignupStats = signupStats.map(stat => ({
    name: stat.month.substring(5), // Strip year part
    value: stat.count
  })).slice(-6); // Just last 6 months

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Insights</CardTitle>
          <CardDescription>Overview of user statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{userStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{userStats.regularCount}</div>
              <div className="text-xs text-muted-foreground">Regular Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{userStats.adminCount}</div>
              <div className="text-xs text-muted-foreground">Admins & Managers</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium">Gender Distribution</h4>
            <div className="h-[120px]">
              {genderData.length === 0 || (genderData.length === 1 && genderData[0].name === 'No Data') ? (
                <div className="flex items-center justify-center h-full border rounded-md bg-muted/10">
                  <p className="text-sm text-muted-foreground">No gender data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sign-up Trends</CardTitle>
          <CardDescription>New users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {formattedSignupStats.length === 0 ? (
              <div className="flex items-center justify-center h-full border rounded-md bg-muted/10">
                <p className="text-sm text-muted-foreground">No signup data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedSignupStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} users`, 'New signups']} />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
