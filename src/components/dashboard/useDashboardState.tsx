
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { performanceMonitor } from '@/utils/performance/PerformanceMonitor';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPuzzles: number;
  activePuzzles: number;
  totalRevenue: number;
  monthlyRevenue: number;
  userGrowth: number;
  completionRate: number;
}

export function useDashboardState() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Start performance tracking
  useEffect(() => {
    performanceMonitor.markStart('dashboard-render');
    
    return () => {
      const duration = performanceMonitor.markEnd('dashboard-render');
      performanceMonitor.recordMetric('dashboard-render-time', duration);
    };
  }, []);
  
  // Fetch dashboard stats
  const statsQuery = useQuery({
    queryKey: ['dashboard-stats', selectedPeriod],
    queryFn: async () => {
      try {
        performanceMonitor.markStart('fetch-dashboard-stats');
        
        // This would be a real API call in a production app
        // For now, return mock data
        const mockData: DashboardStats = {
          totalUsers: 1250,
          activeUsers: 450,
          totalPuzzles: 75,
          activePuzzles: 25,
          totalRevenue: 15750.50,
          monthlyRevenue: 4250.75,
          userGrowth: 12.5,
          completionRate: 68.3
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const duration = performanceMonitor.markEnd('fetch-dashboard-stats');
        performanceMonitor.recordMetric('api-fetch-stats', duration);
        
        return mockData;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch chart data
  const chartQuery = useQuery({
    queryKey: ['chart-data', selectedMetric, selectedPeriod],
    queryFn: async () => {
      try {
        performanceMonitor.markStart('fetch-chart-data');
        
        // This would be a real API call in a production app
        // For now, generate mock data
        const days = selectedPeriod === '30d' ? 30 : selectedPeriod === '7d' ? 7 : 90;
        const data = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - days + i + 1);
          
          let value: number;
          if (selectedMetric === 'users') {
            value = Math.floor(Math.random() * 100) + 50 + (i * 2);
          } else if (selectedMetric === 'revenue') {
            value = Math.floor(Math.random() * 1000) + 500 + (i * 10);
          } else { // completions
            value = Math.floor(Math.random() * 50) + 20 + i;
          }
          
          return {
            date: date.toISOString().split('T')[0],
            value
          };
        });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const duration = performanceMonitor.markEnd('fetch-chart-data');
        performanceMonitor.recordMetric('api-fetch-chart', duration);
        
        return data;
      } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Refresh all data
  const refreshData = useCallback(() => {
    setIsLoading(true);
    
    Promise.all([
      statsQuery.refetch(),
      chartQuery.refetch()
    ])
      .then(() => {
        toast({
          title: 'Dashboard refreshed',
          description: 'The dashboard data has been refreshed.'
        });
      })
      .catch((error) => {
        toast({
          title: 'Refresh failed',
          description: 'Failed to refresh dashboard data.',
          variant: 'destructive'
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [statsQuery, chartQuery, toast]);
  
  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedMetric,
    setSelectedMetric,
    isLoading: isLoading || statsQuery.isLoading || chartQuery.isLoading,
    error: statsQuery.error || chartQuery.error,
    stats: statsQuery.data,
    chartData: chartQuery.data || [],
    refreshData
  };
}
