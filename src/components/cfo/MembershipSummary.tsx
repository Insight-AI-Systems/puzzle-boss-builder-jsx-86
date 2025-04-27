import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MembershipSummary as MembershipData } from '@/types/financeTypes';
import { format, parseISO, subMonths } from 'date-fns';
import { Download, Users, UserMinus, UserCheck } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface MembershipSummaryProps {
  selectedMonth: string;
}

const MembershipSummary: React.FC<MembershipSummaryProps> = ({ selectedMonth }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [membershipData, setMembershipData] = useState<MembershipData[]>([]);
  const { toast } = useToast();

  const COLORS = {
    active: '#10b981',    // Emerald
    lapsed: '#f59e0b',    // Amber
    canceled: '#ef4444',  // Red
    revenue: '#047857'    // Dark Green
  };

  useEffect(() => {
    const fetchMembershipData = async () => {
      setIsLoading(true);
      try {
        // This is a mock implementation since we don't have actual membership data in the database
        // In a real implementation, you'd fetch this from a membership_stats table or calculate it
        
        // Generate 6 months of mock data including the selected month
        const currentDate = parseISO(`${selectedMonth}-01`);
        const mockData: MembershipData[] = [];
        
        for (let i = 5; i >= 0; i--) {
          const date = subMonths(currentDate, i);
          const period = format(date, 'yyyy-MM');
          
          // Generate some reasonable random values
          const active = Math.floor(Math.random() * 500) + 800;
          const lapsed = Math.floor(Math.random() * 50) + 50;
          const canceled = Math.floor(Math.random() * 30) + 20;
          const revenue = active * (Math.random() * 10 + 15); // $15-25 per member
          
          mockData.push({
            period,
            active_members: active,
            lapsed_members: lapsed,
            canceled_members: canceled,
            revenue
          });
        }
        
        setMembershipData(mockData);
      } catch (error) {
        toast({
          title: 'Error fetching membership data',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembershipData();
  }, [selectedMonth]);
  
  // Get the data for the selected month
  const currentMonthData = membershipData.find(data => data.period === selectedMonth) || {
    period: selectedMonth,
    active_members: 0,
    lapsed_members: 0,
    canceled_members: 0,
    revenue: 0
  };

  // Format data for the trend charts
  const memberTrendData = membershipData.map(item => ({
    name: format(parseISO(`${item.period}-01`), 'MMM yyyy'),
    active: item.active_members,
    lapsed: item.lapsed_members,
    canceled: item.canceled_members
  }));

  const revenueTrendData = membershipData.map(item => ({
    name: format(parseISO(`${item.period}-01`), 'MMM yyyy'),
    revenue: item.revenue
  }));

  const handleExportCSV = () => {
    // In a real implementation, you would call a function to export the data
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Membership Summary</h2>
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export Data
        </Button>
      </div>

      {/* Membership Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-xs text-muted-foreground mt-1">
              {membershipData.length >= 2 && 
                `${membershipData[membershipData.length - 1].active_members > membershipData[membershipData.length - 2].active_members ? '+' : ''}${
                  membershipData[membershipData.length - 1].active_members - membershipData[membershipData.length - 2].active_members
                } from last month`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <UserMinus className="mr-2 h-4 w-4 text-orange-500" />
              Lapsed Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMonthData.lapsed_members.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {membershipData.length >= 2 && 
                `${membershipData[membershipData.length - 1].lapsed_members > membershipData[membershipData.length - 2].lapsed_members ? '+' : ''}${
                  membershipData[membershipData.length - 1].lapsed_members - membershipData[membershipData.length - 2].lapsed_members
                } from last month`
              }
            </p>
          </CardContent>
        </Card>

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
            <p className="text-xs text-muted-foreground mt-1">
              {membershipData.length >= 2 && 
                `${membershipData[membershipData.length - 1].canceled_members > membershipData[membershipData.length - 2].canceled_members ? '+' : ''}${
                  membershipData[membershipData.length - 1].canceled_members - membershipData[membershipData.length - 2].canceled_members
                } from last month`
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Membership Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Membership Trends</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer
              config={{
                active: { color: COLORS.active },  // Emerald
                lapsed: { color: COLORS.lapsed },  // Amber
                canceled: { color: COLORS.canceled },  // Red
              }}
              className="aspect-[4/3]"
            >
              <LineChart data={memberTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
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
                revenue: { color: COLORS.revenue },  // Dark Green
              }}
              className="aspect-[4/3]"
            >
              <BarChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
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

      {/* Membership Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">
                {(currentMonthData.active_members + currentMonthData.lapsed_members).toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Retention Rate</p>
              <p className="text-2xl font-bold">
                {currentMonthData.active_members > 0 ? 
                  `${((currentMonthData.active_members / (currentMonthData.active_members + currentMonthData.canceled_members)) * 100).toFixed(1)}%` : 
                  'N/A'}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-500">
                ${currentMonthData.revenue.toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg. Revenue/Member</p>
              <p className="text-2xl font-bold">
                ${currentMonthData.active_members > 0 ? 
                  (currentMonthData.revenue / currentMonthData.active_members).toFixed(2) : 
                  '0.00'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipSummary;
