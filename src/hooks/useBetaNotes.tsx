
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BetaNote {
  id: string;
  content: string;
  status: 'wip' | 'completed';
  user_id: string;
  member_id: string;
  created_at: string;
  updated_at: string;
}

export function useBetaNotes() {
  const [notes, setNotes] = useState<BetaNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotes = async () => {
    if (!user) return;

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
      console.error('Error fetching notes:', error);
      toast({
        title: "Error loading notes",
        description: error instanceof Error ? error.message : "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add notes.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('beta_notes')
        .insert({
          content,
          user_id: user.id,
          member_id: user.id, // Add required member_id field
        });

      if (error) throw error;

      toast({
        title: "Note added",
        description: "Your note has been saved successfully.",
      });

      await fetchNotes(); // Refresh the notes list
      return true;
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error adding note",
        description: error instanceof Error ? error.message : "Failed to add note",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateNoteStatus = async (noteId: string, status: 'wip' | 'completed') => {
    try {
      const { error } = await supabase
        .from('beta_notes')
        .update({ status })
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Note updated",
        description: `Note marked as ${status}.`,
      });

      await fetchNotes(); // Refresh the notes list
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error updating note",
        description: error instanceof Error ? error.message : "Failed to update note",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('beta_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });

      await fetchNotes(); // Refresh the notes list
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error deleting note",
        description: error instanceof Error ? error.message : "Failed to delete note",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  return {
    notes,
    isLoading,
    addNote,
    updateNoteStatus,
    deleteNote,
    refreshNotes: fetchNotes,
  };
}
