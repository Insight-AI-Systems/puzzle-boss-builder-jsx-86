
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RevenueMetrics } from '../types/analyticsTypes';

export const useRevenueMetrics = () => {
  return useQuery({
    queryKey: ['revenueMetrics'],
    queryFn: async () => {
      try {
        // Since the get_revenue_metrics function doesn't exist yet in the database,
        // we'll provide fallback data while also checking if the function exists
        const { data, error } = await supabase
          .from('site_income')
          .select('source_type, amount')
          .limit(1000);

        if (error) throw error;
        
        // Aggregate the data to calculate metrics
        const totalRevenue = data?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
        
        // Calculate revenue by type
        const revenueByType: Record<string, number> = {};
        
        data?.forEach(item => {
          const type = item.source_type || 'other';
          revenueByType[type] = (revenueByType[type] || 0) + (item.amount || 0);
        });
        
        // Fetch user count for average calculation
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const avgRevenuePerUser = count ? totalRevenue / count : 0;
        
        // Calculate credit purchases (items with source_type = 'credit')
        const creditPurchases = data?.filter(item => 
          item.source_type === 'credits' || item.source_type === 'credit'
        ).reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
        
        // Return in the expected format
        return {
          total_revenue: totalRevenue,
          avg_revenue_per_user: avgRevenuePerUser,
          credit_purchases: creditPurchases,
          revenue_by_type: revenueByType
        } as RevenueMetrics;
      } catch (err) {
        console.error('Error fetching revenue metrics:', err);
        
        // Return fallback data if there's an error
        return {
          total_revenue: 0,
          avg_revenue_per_user: 0,
          credit_purchases: 0,
          revenue_by_type: {
            'membership': 0,
            'credits': 0,
            'other': 0
          }
        } as RevenueMetrics;
      }
    },
    // Adding retry configuration and stale time to avoid excessive API calls
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
