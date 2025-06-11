
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useBetaNotes } from '@/hooks/useBetaNotes';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';

export default function BetaNotes() {
  const { notes, isLoading, addNote, updateNoteStatus } = useBetaNotes();
  const { user } = useAuth();
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await addNote({ content: newNote.trim() });
      if (result) {
        setNewNote('');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateNoteStatus(id, status);
    } catch (error) {
      console.error('Error updating note status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'wip': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Beta Notes & Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mb-6">
            <Textarea
              placeholder="Share your feedback, suggestions, or report issues..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mb-4"
              rows={4}
            />
            <Button type="submit" disabled={isSubmitting || !newNote.trim()}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Note
            </Button>
          </form>

          <div className="space-y-4">
            {notes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No notes yet. Share your first feedback!
              </p>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={getStatusBadgeVariant(note.status)}>
                        {note.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(note.id, 'in_progress')}
                        disabled={note.status === 'in_progress'}
                      >
                        In Progress
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(note.id, 'completed')}
                        disabled={note.status === 'completed'}
                      >
                        Completed
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
