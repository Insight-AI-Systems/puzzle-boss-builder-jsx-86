
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types/userTypes';

export interface BetaNote {
  id: string;
  user_id: string;
  content: string;
  status: 'wip' | 'completed';
  created_at: string;
  user: {
    username?: string | null;
    avatar_url?: string | null;
  };
}

export function useBetaNotes() {
  const [notes, setNotes] = useState<BetaNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Using a direct join approach instead of the profiles:user_id syntax
      const { data, error } = await supabase
        .from('beta_notes')
        .select(`
          id, 
          content, 
          status, 
          created_at, 
          user_id,
          profiles!beta_notes_user_id_fkey (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNotes: BetaNote[] = data.map(note => ({
        id: note.id,
        user_id: note.user_id,
        content: note.content,
        status: note.status,
        created_at: note.created_at,
        user: {
          username: note.profiles?.username || 'Unknown User',
          avatar_url: note.profiles?.avatar_url || null
        }
      }));

      setNotes(formattedNotes);
    } catch (error) {
      console.error('Error fetching beta notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (content: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('beta_notes')
        .insert({ content, user_id: user.id })
        .select(`
          id, 
          content, 
          status, 
          created_at, 
          user_id,
          profiles!beta_notes_user_id_fkey (username, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Make sure to handle potentially missing profile data
      const newNote: BetaNote = {
        id: data.id,
        user_id: data.user_id,
        content: data.content,
        status: data.status,
        created_at: data.created_at,
        user: {
          username: data.profiles?.username || 'Unknown User',
          avatar_url: data.profiles?.avatar_url || null
        }
      };

      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error('Error creating beta note:', error);
      return null;
    }
  };

  const updateNoteStatus = async (noteId: string, status: 'wip' | 'completed') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('beta_notes')
        .update({ status })
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => 
        prev.map(note => 
          note.id === noteId ? { ...note, status } : note
        )
      );
    } catch (error) {
      console.error('Error updating note status:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();

      const channel = supabase
        .channel('beta_notes')
        .on(
          'postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'beta_notes' },
          (payload) => {
            fetchNotes();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return { notes, isLoading, createNote, updateNoteStatus };
}
