
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserStats } from '@/types/adminTypes';

interface UserStatsDisplayProps {
  stats: UserStats;
}

export function UserStatsDisplay({ stats }: UserStatsDisplayProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </CardContent>
      </Card>
      
      {stats.genderBreakdown && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2">Gender Distribution</div>
            <div className="space-y-2">
              {Object.entries(stats.genderBreakdown).map(([gender, count]) => (
                <div key={gender} className="flex items-center justify-between">
                  <div className="text-sm">{gender === 'null' ? 'Unspecified' : gender}</div>
                  <div className="text-sm font-medium">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {stats.ageBreakdown && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2">Age Distribution</div>
            <div className="space-y-2">
              {Object.entries(stats.ageBreakdown).map(([age, count]) => (
                <div key={age} className="flex items-center justify-between">
                  <div className="text-sm">{age}</div>
                  <div className="text-sm font-medium">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
