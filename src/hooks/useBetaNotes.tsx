
import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { supabase } from '@/integrations/supabase/client';

export function useBetaNotes() {
  const { user } = useClerkAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('beta_notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotes(data || []);
      } catch (error) {
        console.error('Error fetching beta notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  return { notes, isLoading };
}
