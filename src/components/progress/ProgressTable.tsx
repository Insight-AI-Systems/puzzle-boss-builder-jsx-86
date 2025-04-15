
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProgressItem } from '@/hooks/useProgressItems';
import { ProgressItemRow } from './ProgressItemRow';
import { CommentsSection } from './CommentsSection';

interface ProgressTableProps {
  items: ProgressItem[];
  onAddComment: (content: string, itemId: string) => Promise<boolean>;
}

export const ProgressTable: React.FC<ProgressTableProps> = ({ items, onAddComment }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleComments = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

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
        {items?.map((item) => (
          <React.Fragment key={item.id}>
            <ProgressItemRow 
              item={item} 
              onToggleComments={toggleComments}
              isExpanded={!!expandedItems[item.id]}
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
