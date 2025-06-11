
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

  const addNote = async (title: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('beta_notes')
        .insert([{
          user_id: user.id,
          title: title,
          content: content,
          status: 'new'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const updateNoteStatus = async (noteId: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('beta_notes')
        .update({ status })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, status } : note
      ));
      return data;
    } catch (error) {
      console.error('Error updating note status:', error);
      throw error;
    }
  };

  return { notes, isLoading, addNote, updateNoteStatus };
}
