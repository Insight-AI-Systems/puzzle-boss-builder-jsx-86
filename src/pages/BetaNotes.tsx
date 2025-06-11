
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useBetaNotes } from '@/hooks/useBetaNotes';
import { Loader2 } from 'lucide-react';

export default function BetaNotes() {
  const { notes, isLoading, addNote, updateNoteStatus } = useBetaNotes();
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    try {
      await addNote(newNote.title, newNote.content);
      setNewNote({ title: '', content: '' });
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Beta Notes</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <Textarea
            placeholder="Note content..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
          <Button onClick={handleAddNote}>Add Note</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{note.title}</CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(note.status)}>
                  {note.status}
                </Badge>
                {updateNoteStatus && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateNoteStatus(note.id, 'resolved')}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{note.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(note.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
