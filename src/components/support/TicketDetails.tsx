
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Send, ArrowLeft, Paperclip } from 'lucide-react';
import { TicketStatus, TicketPriority, TicketComment } from '@/types/ticketTypes';
import { useAuth } from '@/contexts/AuthContext';

// Helper to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Status badge component
const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const badgeVariant = 
    status === 'open' ? 'default' :
    status === 'pending' ? 'outline' :
    status === 'resolved' ? 'secondary' : 'destructive';

  return (
    <Badge variant={badgeVariant} className="ml-2">{status}</Badge>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const badgeVariant = 
    priority === 'low' ? 'outline' :
    priority === 'medium' ? 'default' :
    priority === 'high' ? 'secondary' : 'destructive';

  return (
    <Badge variant={badgeVariant} className="ml-2">{priority}</Badge>
  );
};

// Comment component
const Comment = ({ comment }: { comment: TicketComment }) => {
  const isStaff = comment.authorStaff || false;
  
  return (
    <div className={`flex gap-4 ${isStaff ? 'flex-row-reverse' : ''}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={isStaff ? "/staff-avatar.png" : "/user-avatar.png"} />
        <AvatarFallback>
          {isStaff ? 'S' : comment.authorName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 space-y-1 ${isStaff ? 'text-right' : ''}`}>
        <div className="flex items-center">
          <span className="text-sm font-semibold">
            {comment.authorName}
          </span>
          {isStaff && (
            <Badge variant="outline" className="ml-2">Staff</Badge>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${isStaff ? 'bg-primary/10' : 'bg-muted'}`}>
          <p>{comment.content}</p>
          {comment.file && (
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Paperclip className="h-3 w-3 mr-1" />
              <a href="#" className="hover:underline">Attachment</a>
            </div>
          )}
        </div>
        
        <div className="flex text-xs text-muted-foreground">
          <span>{formatDate(comment.date)}</span>
          {comment.edited && (
            <span className="ml-2">(edited)</span>
          )}
        </div>
      </div>
    </div>
  );
};

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
    
    // For file attachments, in a real implementation we would:
    // 1. Upload the file to storage
    // 2. Get back a URL or reference ID
    // 3. Pass that to the comment API
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
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        // Display error
        return;
      }
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
  
  // Determine if the current user is staff (for demo, check if user has admin role)
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
        
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="icon"
        >
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
              <div className="flex items-center">
                <span className="text-sm mr-2">Status:</span>
                {isStaff ? (
                  <Select
                    defaultValue={ticket.status}
                    onValueChange={handleStatusChange}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <StatusBadge status={ticket.status} />
                )}
              </div>
              
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
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <div className="w-full space-y-4">
            <Separator />
            
            <Textarea
              placeholder="Type your response here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
              disabled={addComment.isPending || ticket.status === 'closed'}
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="file"
                  id="comment-attachment"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={addComment.isPending || ticket.status === 'closed'}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('comment-attachment')?.click()}
                  disabled={addComment.isPending || ticket.status === 'closed'}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
                {attachment && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
              
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || addComment.isPending || ticket.status === 'closed'}
              >
                {addComment.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Response
              </Button>
            </div>
            
            {ticket.status === 'closed' && (
              <p className="text-center text-sm text-muted-foreground">
                This ticket is closed and cannot be responded to.
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
