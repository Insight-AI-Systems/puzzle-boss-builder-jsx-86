
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Paperclip } from 'lucide-react';
import { TicketComment } from '@/types/ticketTypes';
import { formatDate } from '../utils/dateUtils';

interface CommentProps {
  comment: TicketComment;
}

export const CommentComponent = ({ comment }: CommentProps) => {
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
