
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from '@/types/adminTypes';

interface MemberInsightsDashboardProps {
  memberStats: UserStats;
  signupStats: Array<{month: string; count: number}>;
}

export const MemberInsightsDashboard: React.FC<MemberInsightsDashboardProps> = ({ memberStats, signupStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Member Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted rounded-md p-4">
            <h3 className="font-medium mb-1">Total Members</h3>
            <p className="text-2xl font-bold">{memberStats.total || 0}</p>
          </div>
          
          {memberStats.genderBreakdown && (
            <div className="bg-muted rounded-md p-4">
              <h3 className="font-medium mb-1">Gender Distribution</h3>
              <div className="space-y-1">
                {Object.entries(memberStats.genderBreakdown).map(([gender, count]) => (
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
          
          {memberStats.ageBreakdown && (
            <div className="bg-muted rounded-md p-4">
              <h3 className="font-medium mb-1">Age Groups</h3>
              <div className="space-y-1">
                {Object.entries(memberStats.ageBreakdown).map(([age, count]) => (
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
