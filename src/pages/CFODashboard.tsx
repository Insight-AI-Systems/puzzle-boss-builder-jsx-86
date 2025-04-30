
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CFOSidebar from '@/components/cfo/CFOSidebar';
import FinancialOverview from '@/components/cfo/FinancialOverview';
import IncomeStreams from '@/components/cfo/IncomeStreams';
import CostStreams from '@/components/cfo/CostStreams';
import MembershipSummary from '@/components/cfo/MembershipSummary';
import CommissionsManagement from '@/components/cfo/CommissionsManagement';
import { MonthlyFinancialSummary, TimeFrame } from '@/types/financeTypes';
import { Loader2 } from 'lucide-react';
import { ErrorDisplay } from '@/components/dashboard/ErrorDisplay';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';

const CFODashboard = () => {
  console.log('[CFO UI] CFODashboard component rendering');
  
  const { hasRole, isLoading: authLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<TimeFrame>('monthly');
  const [isAccessChecking, setIsAccessChecking] = useState(true);
  const isMounted = useRef(true);
  
  // Debugging - log component lifecycle
  useEffect(() => {
    console.log('[CFO UI] CFODashboard mounted');
    
    return () => {
      console.log('[CFO UI] CFODashboard unmounting');
      isMounted.current = false;
    };
  }, []);

  // Check if user has CFO access
  useEffect(() => {
    // Skip access check if auth is still loading or roles aren't loaded
    if (authLoading || !rolesLoaded) {
      console.log('[CFO UI] Auth still loading, delaying access check');
      return;
    }

    const checkAccess = async () => {
      console.log('[CFO UI] Checking user access permissions');
      try {
        const hasCfoAccess = hasRole('cfo');
        const hasAdminAccess = hasRole('super_admin') || hasRole('admin');
        
        console.log('[CFO UI] Access check result:', { hasCfoAccess, hasAdminAccess });
        
        if (!hasCfoAccess && !hasAdminAccess) {
          console.log('[CFO UI] Access denied, redirecting to unauthorized');
          if (isMounted.current) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the CFO dashboard",
              variant: "destructive",
            });
            navigate('/unauthorized');
          }
        }
      } catch (err) {
        console.error('[CFO UI] Error checking user role:', err);
        if (isMounted.current) {
          toast({
            title: "Authentication Error",
            description: "Unable to verify your access permissions",
            variant: "destructive",
          });
          navigate('/unauthorized');
        }
      } finally {
        console.log('[CFO UI] Access check completed');
        if (isMounted.current) {
          setIsAccessChecking(false);
        }
      }
    };
    
    checkAccess();
  }, [hasRole, navigate, toast, authLoading, rolesLoaded]);

  console.log('[CFO UI] CFODashboard render state:', { 
    isAccessChecking, 
    authLoading,
    rolesLoaded
  });

  if (authLoading || !rolesLoaded || isAccessChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-puzzle-aqua" />
          <p className="mt-4 text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['cfo', 'super_admin', 'admin']}>
      <FinancialDataProvider>
        <div className="flex min-h-screen w-full">
          <CFOSidebar />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route index element={<FinancialOverview timeframe={timeframe} />} />
              <Route path="income" element={<IncomeStreams />} />
              <Route path="expenses" element={<CostStreams />} />
              <Route path="memberships" element={<MembershipSummary />} />
              <Route path="commissions" element={<CommissionsManagement />} />
            </Routes>
          </main>
        </div>
      </FinancialDataProvider>
    </ProtectedRoute>
  );
};

export default CFODashboard;
