import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MembershipStats } from '@/types/financeTypes';
import { format, parseISO, subMonths } from 'date-fns';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MemberDetailsDialog } from './dialogs/MemberDetailsDialog';
import { useMemberDetails } from '@/hooks/useMemberDetails';
import { MemberHistoryDetails } from '@/types/membershipTypes';
import { MemberStatsCards } from './membership/MemberStatsCards';
import { MembershipCharts } from './membership/MembershipCharts';
import { KeyMetrics } from './membership/KeyMetrics';

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
        const currentDate = parseISO(`${selectedMonth}-01`);
        const mockData: MembershipStats[] = [];
        
        for (let i = 5; i >= 0; i--) {
          const date = subMonths(currentDate, i);
          const period = format(date, 'yyyy-MM');
          
          const active = Math.floor(Math.random() * 500) + 800;
          const expired = Math.floor(Math.random() * 50) + 50;
          const canceled = Math.floor(Math.random() * 30) + 20;
          const revenue = active * (Math.random() * 10 + 15);
          const churn_rate = (canceled / active) * 100;
          
          mockData.push({
            period,
            active_members: active,
            expired_members: expired,
            canceled_members: canceled,
            revenue,
            churn_rate
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

  const handleExportCSV = () => {
    alert('Export functionality would be implemented here');
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
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export Data
        </Button>
      </div>

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
    </div>
  );
};

export default MembershipSummary;
