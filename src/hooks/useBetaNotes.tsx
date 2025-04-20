
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
      // Use a simpler query approach that doesn't require foreign key references
      const { data: notesData, error: notesError } = await supabase
        .from('beta_notes')
        .select(`
          id, 
          content, 
          status, 
          created_at, 
          user_id
        `)
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;

      // Fetch user profiles in a separate query
      const userIds = [...new Set(notesData.map(note => note.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user profiles for easy lookup
      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Combine notes with user profile data
      const formattedNotes: BetaNote[] = notesData.map(note => {
        const profile = profileMap.get(note.user_id);
        return {
          id: note.id,
          user_id: note.user_id,
          content: note.content,
          status: note.status,
          created_at: note.created_at,
          user: {
            username: profile?.username || 'Unknown User',
            avatar_url: profile?.avatar_url || null
          }
        };
      });

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
      // Insert the new note
      const { data: newNoteData, error: insertError } = await supabase
        .from('beta_notes')
        .insert({ content, user_id: user.id })
        .select('id, content, status, created_at, user_id')
        .single();

      if (insertError) throw insertError;

      // Get the user profile for the new note
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
      }

      // Create the new note object with user profile data
      const newNote: BetaNote = {
        id: newNoteData.id,
        user_id: newNoteData.user_id,
        content: newNoteData.content,
        status: newNoteData.status,
        created_at: newNoteData.created_at,
        user: {
          username: profileData?.username || 'Unknown User',
          avatar_url: profileData?.avatar_url || null
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
        .eq('id', noteId);

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
