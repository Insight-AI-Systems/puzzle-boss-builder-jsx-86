
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';
import { MembershipStats } from '@/types/financeTypes';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface MembershipChartsProps {
  membershipData: MembershipStats[];
}

const COLORS = {
  active: '#10b981',    // Emerald
  lapsed: '#f59e0b',    // Amber
  canceled: '#ef4444',  // Red
  revenue: '#047857'    // Dark Green
};

export const MembershipCharts = ({ membershipData }: MembershipChartsProps) => {
  const memberTrendData = membershipData.map(item => ({
    name: format(parseISO(`${item.period}-01`), 'MMM yyyy'),
    active: item.active_members,
    lapsed: item.expired_members,
    canceled: item.canceled_members
  }));

  const revenueTrendData = membershipData.map(item => ({
    name: format(parseISO(`${item.period}-01`), 'MMM yyyy'),
    revenue: item.revenue
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Membership Trends</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer
            config={{
              active: { color: COLORS.active },
              lapsed: { color: COLORS.lapsed },
              canceled: { color: COLORS.canceled },
            }}
            className="aspect-[4/3]"
          >
            <LineChart data={memberTrendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="active"
                name="Active Members"
                stroke={COLORS.active}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="lapsed"
                name="Lapsed Members"
                stroke={COLORS.lapsed}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="canceled"
                name="Canceled Members"
                stroke={COLORS.canceled}
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Membership Revenue</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer
            config={{
              revenue: { color: COLORS.revenue },
            }}
            className="aspect-[4/3]"
          >
            <BarChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={COLORS.revenue}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
