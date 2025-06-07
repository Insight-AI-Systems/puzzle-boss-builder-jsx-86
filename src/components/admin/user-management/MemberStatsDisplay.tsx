
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserStats } from '@/types/adminTypes';

interface MemberStatsDisplayProps {
  stats: UserStats;
}

export function MemberStatsDisplay({ stats }: MemberStatsDisplayProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Total Members</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          
          {stats.genderBreakdown && Object.keys(stats.genderBreakdown).length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Gender Distribution</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.genderBreakdown).map(([gender, count]) => (
                  <div key={gender} className="bg-background p-2 rounded flex gap-2 items-center">
                    <span className="text-sm">{gender === 'null' ? 'Not Specified' : gender}</span>
                    <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">{String(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {stats.ageBreakdown && Object.keys(stats.ageBreakdown).length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Age Distribution</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.ageBreakdown).map(([age, count]) => (
                  <div key={age} className="bg-background p-2 rounded flex gap-2 items-center">
                    <span className="text-sm">{age}</span>
                    <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">{String(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
