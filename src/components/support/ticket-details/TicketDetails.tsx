
import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSupportTickets } from '@/hooks/support/useSupportTickets';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, MessageSquare, Send, Clock, CheckCircle, ShieldAlert, User } from 'lucide-react';
import { StatusSelector } from './StatusSelector';
import { useToast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/profile/useProfileData';

export const TicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isInternalView = searchParams.get('view') === 'internal';
  const { tickets, isLoading, addComment, updateTicketStatus, isAdmin } = useSupportTickets();
  const [comment, setComment] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const ticket = tickets.find(t => t.id === ticketId);
  const { data: userProfile } = useProfileData(ticket?.created_by || null);

  const handleAddComment = async (e: React.FormEvent, isInternal: boolean = false) => {
    e.preventDefault();
    const content = isInternal ? internalNote : comment;
    if (!content.trim() || !ticketId) return;

    setIsSubmitting(true);
    const prefix = isInternal ? '[INTERNAL NOTE] ' : '[RESPONSE] ';
    const success = await addComment(ticketId, prefix + content.trim());
    if (success) {
      if (isInternal) {
        setInternalNote('');
      } else {
        setComment('');
      }
      toast({
        title: isInternal ? "Internal note added" : "Response sent",
        description: isInternal ? "Your note has been added to the ticket" : "Your response has been sent to the user",
      });
    }
    setIsSubmitting(false);
  };
  
  const handleStatusChange = async (newStatus: string) => {
    if (!ticketId) return;
    
    setIsUpdatingStatus(true);
    await updateTicketStatus(ticketId, newStatus);
    setIsUpdatingStatus(false);
  };

  // Parse comments and notes from the description
  const parseComments = (description: string) => {
    if (!description) return { comments: [], internalNotes: [] };
    
    const parts = description.split('\n\n');
    const comments = [];
    const internalNotes = [];
    
    for (const part of parts) {
      if (part.startsWith('[INTERNAL NOTE] ')) {
        internalNotes.push({
          content: part.replace('[INTERNAL NOTE] ', ''),
          isInternal: true
        });
      } else if (part.startsWith('[RESPONSE] ')) {
        comments.push({
          content: part.replace('[RESPONSE] ', ''),
          isInternal: false
        });
      } else if (part.startsWith('Comment (')) {
        // Handle legacy comments
        const dateSplit = part.split('):\n');
        if (dateSplit.length === 2) {
          comments.push({
            date: dateSplit[0].replace('Comment (', ''),
            content: dateSplit[1],
            isInternal: false
          });
        }
      }
    }
    
    return { comments, internalNotes };
  };
  
  if (isLoading) {
    return <div>Loading ticket details...</div>;
  }

  if (!ticket) {
    return (
      <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-puzzle-aqua mb-4" />
            <h3 className="text-xl font-medium mb-2">Ticket Not Found</h3>
            <p className="text-puzzle-white/70 mb-6">
              The ticket you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate(`/support/tickets${isInternalView ? '?view=internal' : ''}`)}>
              Back to Tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mainContent = ticket.description.split('\n\n[')[0];
  const { comments, internalNotes } = parseComments(ticket.description);
  const isInternalTicket = ticket.category === 'internal';

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(`/support/tickets${isInternalView ? '?view=internal' : ''}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {isInternalTicket ? "Internal Issues" : "Tickets"}
      </Button>

      <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-start">
              {isInternalTicket && isAdmin && (
                <ShieldAlert className="h-5 w-5 text-red-500 mt-1" />
              )}
              <div>
                <CardTitle className="text-xl mb-2">{ticket.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span>From: {userProfile?.display_name || userProfile?.email || 'Unknown User'}</span>
                </div>
                <CardDescription>
                  Ticket #{ticket.id.substring(0, 8)} • Created {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusSelector 
                status={ticket.status}
                isStaff={isAdmin}
                onStatusChange={handleStatusChange}
                isPending={isUpdatingStatus}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-puzzle-white whitespace-pre-wrap">
            {mainContent}
          </div>

          {(comments.length > 0 || internalNotes.length > 0) && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-puzzle-black/40 rounded-lg p-4">
                    <div className="text-puzzle-white whitespace-pre-wrap">
                      {comment.content}
                    </div>
                    {comment.date && (
                      <div className="text-puzzle-white/50 text-sm mt-2">
                        {comment.date}
                      </div>
                    )}
                  </div>
                ))}
                
                {isAdmin && internalNotes.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3 text-red-400">Internal Notes</h4>
                    {internalNotes.map((note, index) => (
                      <div key={index} className="bg-red-950/20 border border-red-900/30 rounded-lg p-4 mb-3">
                        <div className="text-puzzle-white whitespace-pre-wrap">
                          {note.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <Separator className="my-6" />

          {isAdmin && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Add Internal Note</h3>
              <form onSubmit={(e) => handleAddComment(e, true)} className="space-y-4">
                <Textarea
                  placeholder="Add an internal note (only visible to staff)..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="min-h-[100px] bg-red-950/20 border-red-900/30"
                />
                <Button 
                  type="submit" 
                  variant="destructive"
                  disabled={!internalNote.trim() || isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <ShieldAlert className="h-4 w-4" />
                      Add Internal Note
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">Add Response</h3>
            <form onSubmit={(e) => handleAddComment(e, false)} className="space-y-4">
              <Textarea
                placeholder="Type your response here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] bg-puzzle-black/40 border-puzzle-aqua/20"
              />
              <Button 
                type="submit" 
                disabled={!comment.trim() || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Response
                  </>
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
