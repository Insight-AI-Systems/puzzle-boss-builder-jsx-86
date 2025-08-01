import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SessionInfo {
  id: string;
  device: string;
  location: string;
  ip_address?: string;
  last_active: string;
  is_current: boolean;
}

export function useSessionManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user agent info
  const getUserAgentInfo = (userAgent?: string) => {
    if (!userAgent) return 'Unknown device';
    
    // Basic user agent parsing
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      return 'iOS Device';
    } else if (userAgent.includes('Android')) {
      return 'Android Device';
    } else if (userAgent.includes('Windows')) {
      return 'Windows Device';
    } else if (userAgent.includes('Mac')) {
      return 'Mac Device';
    } else if (userAgent.includes('Linux')) {
      return 'Linux Device';
    }
    
    return 'Unknown device';
  };

  // Get location info from IP (simplified)
  const getLocationInfo = (ip?: string) => {
    if (!ip) return 'Unknown location';
    return `IP: ${ip}`;
  };

  // Fetch all sessions for the current user
  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch sessions from the database
      const { data, error: fetchError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_active', { ascending: false });
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Transform to SessionInfo objects
      const sessionInfoList: SessionInfo[] = data.map(s => ({
        id: s.id,
        device: getUserAgentInfo(s.user_agent),
        location: getLocationInfo(s.ip_address),
        ip_address: s.ip_address,
        last_active: new Date(s.last_active).toLocaleString(),
        is_current: s.is_active
      }));
      
      setSessions(sessionInfoList);
      
    } catch (err) {
      console.error('Fetch sessions error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
      
      toast({
        title: 'Error retrieving sessions',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Terminate a specific session
  const terminateSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Update the session to inactive
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId)
        .eq('user_id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update the local state
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, is_active: false } : s
      ));
      
      toast({
        title: 'Session terminated',
        description: 'The session has been successfully terminated',
      });
      
      // Refresh the sessions list
      await fetchSessions();
      
    } catch (err) {
      console.error('Terminate session error:', err);
      setError(err instanceof Error ? err.message : 'Failed to terminate session');
      
      toast({
        title: 'Error terminating session',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Terminate all other sessions
  const terminateAllOtherSessions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the database function to terminate other sessions
      const { error: rpcError } = await supabase.rpc(
        'terminate_other_sessions',
        { user_id: user.id }
      );
      
      if (rpcError) {
        throw rpcError;
      }
      
      toast({
        title: 'All other sessions terminated',
        description: 'All other sessions have been successfully terminated',
      });
      
      // Refresh the sessions list
      await fetchSessions();
      
    } catch (err) {
      console.error('Terminate all sessions error:', err);
      setError(err instanceof Error ? err.message : 'Failed to terminate sessions');
      
      toast({
        title: 'Error terminating sessions',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load sessions on mount
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    terminateSession,
    terminateAllOtherSessions
  };
}
