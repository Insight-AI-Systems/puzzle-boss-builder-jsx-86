
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from '@/types/adminTypes';

interface UserInsightsDashboardProps {
  userStats: UserStats;
  signupStats: Array<{month: string; count: number}>;
}

export const UserInsightsDashboard: React.FC<UserInsightsDashboardProps> = ({ userStats, signupStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">User Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted rounded-md p-4">
            <h3 className="font-medium mb-1">Total Users</h3>
            <p className="text-2xl font-bold">{userStats.total || 0}</p>
          </div>
          
          {userStats.genderBreakdown && (
            <div className="bg-muted rounded-md p-4">
              <h3 className="font-medium mb-1">Gender Distribution</h3>
              <div className="space-y-1">
                {Object.entries(userStats.genderBreakdown).map(([gender, count]) => (
                  <div key={gender} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {gender === 'null' ? 'Not specified' : gender}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {userStats.ageBreakdown && (
            <div className="bg-muted rounded-md p-4">
              <h3 className="font-medium mb-1">Age Groups</h3>
              <div className="space-y-1">
                {Object.entries(userStats.ageBreakdown).map(([age, count]) => (
                  <div key={age} className="flex justify-between">
                    <span className="text-muted-foreground">{age}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
