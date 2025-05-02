
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';

interface DateRange {
  from: Date;
  to: Date;
}

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
  
  // Mock data for demonstration
  const defaultDeliveryStats: DeliveryStats = {
    sent: 1000,
    delivered: 950,
    opened: 570,
    clicked: 285,
    deliveryRate: 95,
    openRate: 60,
    clickRate: 30,
    bounceRate: 5,
    mobilePct: 60,
    desktopPct: 25,
    webmailPct: 10,
    otherPct: 5
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
        // In a real application, this would fetch data from SendGrid API via your edge function
        // For now, we'll return mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        // Generate mock engagement data over the date range
        const engagementData = [];
        let currentDate = dateRange?.from || subDays(new Date(), 30);
        const endDate = dateRange?.to || new Date();
        
        while (currentDate <= endDate) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          const dayMult = 1 - Math.random() * 0.3; // Random multiplier for variation
          
          engagementData.push({
            date: dateStr,
            sent: Math.round(100 * dayMult),
            opened: Math.round(60 * dayMult),
            clicked: Math.round(30 * dayMult),
          });
          
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
        
        // Mock click data
        const clicksData = [
          { link: 'Homepage', clicks: 145 },
          { link: 'Product Page', clicks: 98 },
          { link: 'Pricing', clicks: 64 },
          { link: 'Account Settings', clicks: 42 },
          { link: 'Support', clicks: 36 }
        ];
        
        // Mock campaigns list
        const campaignsList = [
          { id: 'c1', name: 'Welcome Series' },
          { id: 'c2', name: 'Monthly Newsletter' },
          { id: 'c3', name: 'Product Announcement' },
          { id: 'c4', name: 'Spring Promotion' }
        ];
        
        return {
          deliveryStats: defaultDeliveryStats,
          engagementData,
          clicksData,
          campaignsList
        };
      } catch (error) {
        console.error('Error fetching email analytics:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false
  });

  // Export data function
  const exportData = () => {
    // In a real app, this would generate and download a CSV file
    toast({
      title: "Export started",
      description: "Your data export is being prepared and will download shortly.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your data has been exported successfully.",
      });
    }, 2000);
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
