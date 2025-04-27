
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Membership, MembershipStats } from '@/types/financeTypes';

export function useMembershipRecords() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembershipRecords = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('memberships')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .gte('start_date', startDate)
        .lte('start_date', endDate);

      if (queryError) throw queryError;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch membership records'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembershipStats = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.rpc('get_membership_stats', {
        start_date: startDate,
        end_date: endDate
      });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch membership stats'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const exportDataToCSV = (data: Membership[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(',');
    const csvData = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${csvData}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    isLoading,
    error,
    fetchMembershipRecords,
    fetchMembershipStats,
    exportDataToCSV
  };
}
