
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTicketDetails } from '@/hooks/useTicketDetails';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { TicketHeader } from './ticket-details/TicketHeader';
import { TicketContent } from './ticket-details/TicketContent';

export default function TicketDetails() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  
  const {
    ticketDetails,
    isLoading,
    isError,
    addComment,
    updateStatus,
    refetch
  } = useTicketDetails(ticketId);

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate(newStatus);
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const fileReference = attachment ? 'file-reference-placeholder' : undefined;
    
    addComment.mutate({ 
      content: newComment.trim(),
      file: fileReference
    }, {
      onSuccess: () => {
        setNewComment('');
        setAttachment(null);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) return;
      setAttachment(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-puzzle-aqua" />
      </div>
    );
  }

  if (isError || !ticketDetails) {
    return (
      <div className="p-6 text-center border border-destructive rounded-md">
        <p>Failed to load ticket details. Please try again later.</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  const ticket = ticketDetails.ticket;
  const comments = ticketDetails.comments || [];
  const isStaff = user?.role === 'super_admin' || user?.role === 'admin';
  
  return (
    <div className="space-y-6">
      <TicketHeader ticketId={ticket.id} refetch={refetch} />
      <TicketContent
        ticket={ticket}
        comments={comments}
        isStaff={isStaff}
        handleStatusChange={handleStatusChange}
        updateStatus={updateStatus}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        handleFileChange={handleFileChange}
        attachment={attachment}
        addComment={addComment}
      />
    </div>
  );
}
