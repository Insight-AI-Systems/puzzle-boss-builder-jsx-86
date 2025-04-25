
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupportTickets } from '@/hooks/support/useSupportTickets';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';

export const TicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { tickets, isLoading, addComment } = useSupportTickets();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ticket = tickets.find(t => t.id === ticketId);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !ticketId) return;

    setIsSubmitting(true);
    const success = await addComment(ticketId, comment.trim());
    if (success) {
      setComment('');
    }
    setIsSubmitting(false);
  };

  // Parse comments from the description for now
  // In a real implementation, this would come from a comments table
  const parseComments = (description: string) => {
    if (!description) return [];
    
    const parts = description.split('\n\nComment (');
    if (parts.length <= 1) return [];
    
    const comments = [];
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const dateSplit = part.split('):\n');
      if (dateSplit.length === 2) {
        comments.push({
          date: dateSplit[0],
          content: dateSplit[1]
        });
      }
    }
    
    return comments;
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': 
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'in-progress': 
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
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
              The support ticket you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate('/support/tickets')}>
              Back to Tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mainContent = ticket.description.split('\n\nComment')[0];
  const comments = parseComments(ticket.description);

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/support/tickets')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tickets
      </Button>

      <Card className="bg-puzzle-black/30 border-puzzle-aqua/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              <CardDescription>
                Ticket #{ticket.id.substring(0, 8)} • Created {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-puzzle-black/40">
              {getStatusIcon(ticket.status)}
              <span className="capitalize">{ticket.status.replace('-', ' ')}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-puzzle-white whitespace-pre-wrap">
            {mainContent}
          </div>

          {comments.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comments</h3>
                {comments.map((comment, index) => (
                  <div key={index} className="bg-puzzle-black/40 rounded-lg p-4">
                    <div className="text-puzzle-white whitespace-pre-wrap">
                      {comment.content}
                    </div>
                    <div className="text-puzzle-white/50 text-sm mt-2">
                      {comment.date}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-4">Add Comment</h3>
            <form onSubmit={handleAddComment} className="space-y-4">
              <Textarea
                placeholder="Type your comment here..."
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
                    Submit Comment
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
