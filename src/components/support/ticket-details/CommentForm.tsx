
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Send, Paperclip } from 'lucide-react';

interface CommentFormProps {
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attachment: File | null;
  isPending: boolean;
  isTicketClosed: boolean;
}

export const CommentForm = ({
  newComment,
  setNewComment,
  handleAddComment,
  handleFileChange,
  attachment,
  isPending,
  isTicketClosed,
}: CommentFormProps) => {
  return (
    <div className="w-full space-y-4">
      <Separator />
      
      <Textarea
        placeholder="Type your response here..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="min-h-[100px]"
        disabled={isPending || isTicketClosed}
      />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="file"
            id="comment-attachment"
            className="hidden"
            onChange={handleFileChange}
            disabled={isPending || isTicketClosed}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('comment-attachment')?.click()}
            disabled={isPending || isTicketClosed}
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
          disabled={!newComment.trim() || isPending || isTicketClosed}
        >
          {isPending ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Send Response
        </Button>
      </div>
      
      {isTicketClosed && (
        <p className="text-center text-sm text-muted-foreground">
          This ticket is closed and cannot be responded to.
        </p>
      )}
    </div>
  );
};
