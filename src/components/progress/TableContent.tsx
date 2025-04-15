
import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProgressItem } from '@/hooks/useProgressItems';
import { ProgressItemRow } from './ProgressItemRow';
import { CommentsSection } from './CommentsSection';

interface TableContentProps {
  items: ProgressItem[];
  expandedItems: Record<string, boolean>;
  onToggleComments: (id: string) => void;
  onAddComment: (content: string, itemId: string) => Promise<boolean>;
  onUpdateStatus: (itemId: string, status: string) => Promise<boolean>;
  onUpdatePriority: (itemId: string, priority: string) => Promise<boolean>;
}

export const TableContent: React.FC<TableContentProps> = ({
  items,
  expandedItems,
  onToggleComments,
  onAddComment,
  onUpdateStatus,
  onUpdatePriority
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 rounded-md p-8 text-center">
        <p className="text-puzzle-white text-lg">No tasks found. Try adjusting your filters or synchronize project tasks.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-puzzle-aqua/20">
          <TableHead className="text-puzzle-aqua">Task</TableHead>
          <TableHead className="text-puzzle-aqua">Status</TableHead>
          <TableHead className="text-puzzle-aqua">Priority</TableHead>
          <TableHead className="text-puzzle-aqua">Last Updated</TableHead>
          <TableHead className="text-puzzle-aqua">Comments</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <ProgressItemRow 
              item={item} 
              onToggleComments={onToggleComments}
              isExpanded={!!expandedItems[item.id]}
              onStatusChange={onUpdateStatus}
              onPriorityChange={onUpdatePriority}
            />
            {expandedItems[item.id] && (
              <CommentsSection item={item} onAddComment={onAddComment} />
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
