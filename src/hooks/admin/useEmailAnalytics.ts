
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DeliveryStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  mobilePct: number;
  desktopPct: number;
  webmailPct: number;
  otherPct: number;
}

interface Campaign {
  id: string;
  name: string;
}

export function useEmailAnalytics(dateRange?: DateRange, campaignId: string = 'all') {
  const { toast } = useToast();
  
  // Default values for when data is loading or not available
  const defaultDeliveryStats: DeliveryStats = {
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
    mobilePct: 0,
    desktopPct: 0,
    webmailPct: 0,
    otherPct: 0
  };

  // Query for analytics data
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['email-analytics', dateRange, campaignId],
    queryFn: async () => {
      try {
        const startDate = dateRange?.from || subDays(new Date(), 30);
        const endDate = dateRange?.to || new Date();
        
        // Get delivery stats using the database function
        const { data: statsData, error: statsError } = await supabase.rpc(
          'get_email_analytics',
          { 
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            campaign_id_param: campaignId === 'all' ? null : campaignId
          }
        );
        
        if (statsError) throw statsError;
        
        // Get engagement data over time
        const { data: engagementData, error: engagementError } = await supabase
          .from('email_engagement')
          .select('date, sent, opened, clicked')
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])
          .order('date', { ascending: true });
          
        if (engagementError) throw engagementError;
        
        // Get link click data
        const { data: clicksData, error: clicksError } = await supabase
          .from('email_link_clicks')
          .select('link, clicks')
          .eq(campaignId !== 'all', 'campaign_id', campaignId)
          .order('clicks', { ascending: false })
          .limit(10);
          
        if (clicksError) throw clicksError;
        
        // Get campaigns list
        const { data: campaignsList, error: campaignsError } = await supabase
          .from('email_campaigns')
          .select('id, name')
          .order('created_at', { ascending: false });
          
        if (campaignsError) throw campaignsError;
        
        // Process and return all the analytics data
        return {
          deliveryStats: statsData && statsData.length > 0 ? statsData[0] : defaultDeliveryStats,
          engagementData: engagementData || [],
          clicksData: clicksData || [],
          campaignsList: campaignsList || []
        };
      } catch (error) {
        console.error('Error fetching email analytics:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false
  });

  // Export data function - in a real app, this would generate and download data
  const exportData = async () => {
    try {
      toast({
        title: "Export started",
        description: "Your data export is being prepared and will download shortly.",
      });
      
      // In a real implementation, this would create a CSV file from the data
      // We'll just simulate a successful export for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Date,Sent,Delivered,Opened,Clicked\n" +
        (data?.engagementData || []).map(row => 
          `${row.date},${row.sent},${row.opened},${row.clicked}`
        ).join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `email-analytics-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export complete",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  return {
    deliveryStats: data?.deliveryStats || defaultDeliveryStats,
    engagementStats: data?.engagementData || [],
    clickRates: data?.clicksData || [],
    campaignsList: data?.campaignsList || [],
    isLoading,
    error,
    exportData
  };
}
