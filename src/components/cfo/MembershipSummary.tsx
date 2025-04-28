
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MembershipStats } from '@/types/financeTypes';
import { format, parseISO } from 'date-fns';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MemberDetailsDialog } from './dialogs/MemberDetailsDialog';
import { useMemberDetails } from '@/hooks/useMemberDetails';
import { MemberHistoryDetails } from '@/types/membershipTypes';
import { MemberStatsCards } from './membership/MemberStatsCards';
import { MembershipCharts } from './membership/MembershipCharts';
import { KeyMetrics } from './membership/KeyMetrics';
import { supabase } from '@/integrations/supabase/client';

interface MembershipSummaryProps {
  selectedMonth: string;
}

const MembershipSummary: React.FC<MembershipSummaryProps> = ({ selectedMonth }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [membershipData, setMembershipData] = useState<MembershipStats[]>([]);
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [memberDetails, setMemberDetails] = useState<MemberHistoryDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { fetchMemberDetails } = useMemberDetails();

  useEffect(() => {
    const fetchMembershipData = async () => {
      setIsLoading(true);
      try {
        // Calculate the start date (6 months back from the selected month)
        const endDate = parseISO(`${selectedMonth}-01`);
        const startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 5); // Get 6 months of data

        const { data, error } = await supabase.rpc('get_membership_stats', {
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd')
        });

        if (error) {
          console.error('Error fetching membership data:', error);
          throw error;
        }

        // Log the raw data for debugging
        console.log('Membership stats raw data:', data);

        if (!data || data.length === 0) {
          console.warn('No membership data returned from the database');
          setMembershipData([]);
          return;
        }

        const formattedData: MembershipStats[] = data.map((item: any) => {
          // Ensure period is formatted consistently as YYYY-MM
          const periodDate = new Date(item.period);
          return {
            period: format(periodDate, 'yyyy-MM'),
            active_members: item.active_members || 0,
            expired_members: item.expired_members || 0,
            canceled_members: item.canceled_members || 0,
            revenue: item.monthly_revenue || 0,
            churn_rate: item.monthly_churn || 0
          };
        });

        console.log('Formatted membership data:', formattedData);
        setMembershipData(formattedData);
      } catch (error) {
        console.error('Error in membership data fetch:', error);
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
  }, [selectedMonth, toast]);

  const handleExportCSV = () => {
    if (!membershipData.length) return;
    
    const headers = Object.keys(membershipData[0]).join(',');
    const csvData = membershipData.map(row => 
      Object.values(row).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${csvData}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `membership-stats-${selectedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMemberClick = async (userId: string, username: string) => {
    const details = await fetchMemberDetails(userId);
    if (details) {
      setMemberDetails(details);
      setSelectedMember(username);
      setDialogOpen(true);
    }
  };

  // Fallback data if no current month is found
  const defaultMonthData: MembershipStats = {
    period: selectedMonth,
    active_members: 0,
    expired_members: 0,
    canceled_members: 0,
    revenue: 0,
    churn_rate: 0
  };

  // Find the data for the selected month, or use default
  const currentMonthData = membershipData.find(data => data.period === selectedMonth) || defaultMonthData;

  // Get the previous month's data if available
  const previousMonthIndex = membershipData.findIndex(data => data.period === selectedMonth) - 1;
  const previousMonthData = previousMonthIndex >= 0 ? membershipData[previousMonthIndex] : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Membership Summary</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportCSV} 
          disabled={!membershipData.length}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Export Data
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : membershipData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8">
          <p className="text-muted-foreground mb-4">No membership data available for the selected period.</p>
          <p className="text-sm">This might be because there are no memberships recorded in the database, or there might be an issue with the database function.</p>
        </div>
      ) : (
        <>
          <MemberStatsCards 
            currentMonthData={currentMonthData}
            previousMonthData={previousMonthData}
          />

          <MembershipCharts membershipData={membershipData} />

          <KeyMetrics currentMonthData={currentMonthData} />

          <MemberDetailsDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            details={memberDetails}
            username={selectedMember || ''}
          />
        </>
      )}
    </div>
  );
};

export default MembershipSummary;
