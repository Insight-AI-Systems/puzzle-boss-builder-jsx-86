
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBetaNotes } from '@/hooks/useBetaNotes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layouts/PageLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const BetaNotes: React.FC = () => {
  const { notes, isLoading, createNote, updateNoteStatus } = useBetaNotes();
  const [newNote, setNewNote] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note before submitting.",
        variant: "destructive"
      });
      return;
    }

    const result = await createNote(newNote);
    
    if (result) {
      setNewNote('');
      toast({
        title: "Note Submitted",
        description: "Your beta note has been added successfully.",
      });
    }
  };

  const toggleNoteStatus = async (noteId: string, currentStatus: 'wip' | 'completed') => {
    const newStatus = currentStatus === 'wip' ? 'completed' : 'wip';
    await updateNoteStatus(noteId, newStatus);
  };

  return (
    <ProtectedRoute>
      <PageLayout 
        title="Beta Testing Notes" 
        subtitle="Share insights and track improvements for our platform"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Note</CardTitle>
              <CardDescription>
                Help us improve by sharing your observations, suggestions, or bugs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea 
                  placeholder="Enter your beta testing note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button type="submit" className="w-full">
                  Submit Note
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
              </div>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="hover:bg-background/50 transition-colors">
                  <CardContent className="flex items-start space-x-4 p-4">
                    <Avatar>
                      <AvatarImage src={note.user.avatar_url || ''} alt={note.user.username || 'User'} />
                      <AvatarFallback>{note.user.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{note.user.username || 'Anonymous User'}</p>
                          <p className="text-sm text-muted-foreground">{new Date(note.created_at).toLocaleString()}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleNoteStatus(note.id, note.status)}
                          className={`
                            ${note.status === 'completed' 
                              ? 'text-green-500 hover:text-green-600' 
                              : 'text-amber-500 hover:text-amber-600'
                            }`
                          }
                        >
                          {note.status === 'completed' ? <CheckCircle /> : <AlertCircle />}
                        </Button>
                      </div>
                      <p className="mt-2">{note.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {!isLoading && notes.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No beta notes yet. Be the first to submit one!
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default BetaNotes;
