
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
        const endDate = parseISO(`${selectedMonth}-01`);
        const startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 5); // Get 6 months of data

        const { data, error } = await supabase.rpc('get_membership_stats', {
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd')
        });

        if (error) {
          throw error;
        }

        const formattedData: MembershipStats[] = (data || []).map(item => ({
          period: format(new Date(item.period), 'yyyy-MM'),
          active_members: item.active_members || 0,
          expired_members: item.expired_members || 0,
          canceled_members: item.canceled_members || 0,
          revenue: item.revenue || 0,
          churn_rate: item.churn_rate || 0
        }));

        setMembershipData(formattedData);
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

  const currentMonthData = membershipData.find(data => data.period === selectedMonth) || {
    period: selectedMonth,
    active_members: 0,
    expired_members: 0,
    canceled_members: 0,
    revenue: 0,
    churn_rate: 0
  };

  const previousMonthData = membershipData[membershipData.length - 2];

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
