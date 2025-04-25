
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketDetails } from '@/hooks/useTicketDetails';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paperclip, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PriorityBadge } from './badges/PriorityBadge';
import { CommentComponent } from './ticket-details/CommentComponent';
import { StatusSelector } from './ticket-details/StatusSelector';
import { CommentForm } from './ticket-details/CommentForm';
import { formatDate } from './utils/dateUtils';

export default function TicketDetails() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
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
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/support/tickets')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to tickets
        </Button>
        
        <h2 className="text-xl font-bold flex-1">Ticket #{ticket.id}</h2>
        
        <Button onClick={() => refetch()} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{ticket.title}</CardTitle>
              <CardDescription>
                Submitted by {ticket.userEmail} on {formatDate(ticket.date)}
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <StatusSelector
                status={ticket.status}
                isStaff={isStaff}
                onStatusChange={handleStatusChange}
                isPending={updateStatus.isPending}
              />
              
              <div className="flex items-center">
                <span className="text-sm mr-2">Priority:</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>{ticket.content}</p>
            {ticket.file && (
              <div className="mt-2 flex items-center text-sm">
                <Paperclip className="h-3 w-3 mr-1" />
                <a href="#" className="hover:underline">View attachment</a>
              </div>
            )}
          </div>
          
          {comments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Conversation</h3>
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <CommentForm
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            handleFileChange={handleFileChange}
            attachment={attachment}
            isPending={addComment.isPending}
            isTicketClosed={ticket.status === 'closed'}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
