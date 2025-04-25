
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Paperclip } from 'lucide-react';
import { StatusSelector } from './StatusSelector';
import { PriorityBadge } from '../badges/PriorityBadge';
import { CommentComponent } from './CommentComponent';
import { CommentForm } from './CommentForm';
import { formatDate } from '../utils/dateUtils';
import { Ticket, TicketComment } from '@/types/ticketTypes';

interface TicketContentProps {
  ticket: Ticket;
  comments: TicketComment[];
  isStaff: boolean;
  handleStatusChange: (newStatus: string) => void;
  updateStatus: { isPending: boolean };
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attachment: File | null;
  addComment: { isPending: boolean };
}

export const TicketContent = ({
  ticket,
  comments,
  isStaff,
  handleStatusChange,
  updateStatus,
  newComment,
  setNewComment,
  handleAddComment,
  handleFileChange,
  attachment,
  addComment,
}: TicketContentProps) => {
  return (
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
  );
};
