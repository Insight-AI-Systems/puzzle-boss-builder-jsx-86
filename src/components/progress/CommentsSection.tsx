
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { ProgressItem } from '@/hooks/useProgressItems';

interface CommentsSectionProps {
  item: ProgressItem;
  onAddComment: (content: string, itemId: string) => Promise<boolean>;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ item, onAddComment }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const success = await onAddComment(comment.trim(), item.id);
      if (success) {
        setComment('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TableRow className="bg-puzzle-black/30">
      <TableCell colSpan={5} className="p-4">
        <div className="space-y-4">
          {item.progress_comments.map((comment) => (
            <div key={comment.id} className="bg-puzzle-black/30 p-4 rounded-lg border border-puzzle-aqua/10">
              <p className="text-puzzle-white/80">{comment.content}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-puzzle-white/40">
                <Calendar className="h-4 w-4" />
                {new Date(comment.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <Textarea 
              placeholder="Add your comment or suggestion..."
              className="bg-puzzle-black/30 border-puzzle-aqua/20 text-puzzle-white"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button 
              onClick={handleSubmit}
              className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
              disabled={isSubmitting || !comment.trim()}
            >
              Add Comment
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
