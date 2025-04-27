
import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSupportTickets } from '@/hooks/support/useSupportTickets';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/hooks/profile/useProfileData';
import { TicketHeader } from './TicketHeader';
import { TicketContent } from './TicketContent';
import { useToast } from '@/hooks/use-toast';

export const TicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [searchParams] = useSearchParams();
  const isInternalView = searchParams.get('view') === 'internal';
  const { tickets, isLoading, addComment, updateTicketStatus, isAdmin } = useSupportTickets();
  const [comment, setComment] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const ticket = tickets.find(t => t.id === ticketId);
  const { data: userProfile } = useProfileData(ticket?.created_by || null);

  const handleAddComment = async () => {
    if (!comment.trim() || !ticketId || isSubmitting) return;

    setIsSubmitting(true);
    const success = await addComment(ticketId, comment.trim());
    if (success) {
      setComment('');
      setAttachment(null);
      toast({
        title: "Comment added",
        description: "Your comment has been added to the ticket",
      });
    }
    setIsSubmitting(false);
  };
  
  const handleStatusChange = async (newStatus: string) => {
    if (!ticketId || isUpdatingStatus) return;
    
    setIsUpdatingStatus(true);
    await updateTicketStatus(ticketId, newStatus);
    setIsUpdatingStatus(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  if (isLoading) {
    return <div>Loading ticket details...</div>;
  }

  if (!ticket) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-puzzle-aqua mb-4" />
            <h3 className="text-xl font-medium mb-2">Ticket Not Found</h3>
            <p className="text-puzzle-white/70 mb-6">
              The ticket you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate('/support/tickets')}>
              Back to Tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const comments = ticket.comments || [];

  return (
    <div className="space-y-6">
      <TicketHeader ticketId={ticket.id} refetch={() => {}} />
      
      <TicketContent
        ticket={ticket}
        comments={comments}
        isStaff={isAdmin}
        handleStatusChange={handleStatusChange}
        updateStatus={{ isPending: isUpdatingStatus }}
        newComment={comment}
        setNewComment={setComment}
        handleAddComment={handleAddComment}
        handleFileChange={handleFileChange}
        attachment={attachment}
        addComment={{ isPending: isSubmitting }}
      />
    </div>
  );
};
