
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { UserCheck, UserMinus, Users } from 'lucide-react';
import { MembershipStats } from '@/types/financeTypes';

interface MemberStatsCardsProps {
  currentMonthData: MembershipStats;
  previousMonthData?: MembershipStats;
}

export const MemberStatsCards = ({ currentMonthData, previousMonthData }: MemberStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                  Active Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentMonthData.active_members.toLocaleString()}
                </div>
                {previousMonthData && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {`${currentMonthData.active_members > previousMonthData.active_members ? '+' : ''}${
                      currentMonthData.active_members - previousMonthData.active_members
                    } from last month`}
                  </p>
                )}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Current paying members</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <UserMinus className="mr-2 h-4 w-4 text-orange-500" />
                  Expired Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentMonthData.expired_members.toLocaleString()}
                </div>
                {previousMonthData && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {`${currentMonthData.expired_members > previousMonthData.expired_members ? '+' : ''}${
                      currentMonthData.expired_members - previousMonthData.expired_members
                    } from last month`}
                  </p>
                )}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Members with expired subscriptions</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <Users className="mr-2 h-4 w-4 text-red-500" />
                  Canceled Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentMonthData.canceled_members.toLocaleString()}
                </div>
                {previousMonthData && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {`${currentMonthData.canceled_members > previousMonthData.canceled_members ? '+' : ''}${
                      currentMonthData.canceled_members - previousMonthData.canceled_members
                    } from last month`}
                  </p>
                )}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Members who have canceled their subscription</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
