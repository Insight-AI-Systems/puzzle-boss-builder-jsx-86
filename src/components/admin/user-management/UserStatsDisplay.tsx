
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Clock } from "lucide-react";

interface UserStatProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  description?: string;
}

interface UserStatsDisplayProps {
  stats: {
    totalCount: number;
    adminCount: number;
    regularCount: number;
    activeLastWeek?: number;
    newThisMonth?: number;
  };
}

const UserStat: React.FC<UserStatProps> = ({ icon, label, value, description }) => (
  <div className="flex items-center space-x-4">
    <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  </div>
);

export const UserStatsDisplay: React.FC<UserStatsDisplayProps> = ({ stats }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UserStat
            icon={<Users className="h-5 w-5 text-blue-600" />}
            label="Total Users"
            value={stats.totalCount}
          />
          <UserStat
            icon={<ShieldCheck className="h-5 w-5 text-amber-600" />}
            label="Admin Users"
            value={stats.adminCount}
            description={`${((stats.adminCount / stats.totalCount) * 100).toFixed(1)}% of total users`}
          />
          {stats.activeLastWeek !== undefined && (
            <UserStat
              icon={<Clock className="h-5 w-5 text-green-600" />}
              label="Active Last Week"
              value={stats.activeLastWeek}
              description={`${((stats.activeLastWeek / stats.totalCount) * 100).toFixed(1)}% of total users`}
            />
          )}
          {stats.newThisMonth !== undefined && (
            <UserStat
              icon={<Users className="h-5 w-5 text-purple-600" />}
              label="New This Month"
              value={stats.newThisMonth}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
