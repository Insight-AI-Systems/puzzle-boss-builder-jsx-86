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
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface ProgressTableProps {
  items: ProgressItem[];
  onAddComment: (content: string, itemId: string) => Promise<boolean>;
  onUpdateStatus: (itemId: string, status: string) => Promise<boolean>;
  onUpdatePriority: (itemId: string, priority: string) => Promise<boolean>;
}

export const ProgressTable: React.FC<ProgressTableProps> = ({ 
  items, 
  onAddComment,
  onUpdateStatus,
  onUpdatePriority
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleComments = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const filteredItems = items.filter(item => {
    if (statusFilter && item.status !== statusFilter) return false;
    if (priorityFilter && item.priority !== priorityFilter) return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - 
                        priorityOrder[a.priority as keyof typeof priorityOrder];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const resetFilters = () => {
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                <DropdownMenuRadioItem value={undefined}>All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in_progress">In Progress</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={priorityFilter} onValueChange={setPriorityFilter}>
                <DropdownMenuRadioItem value={undefined}>All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              
              <DropdownMenuSeparator />
              
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                <DropdownMenuRadioItem value="desc">Newest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="asc">Oldest First</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-puzzle-white text-sm">
          {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'} found
        </div>
      </div>
      
      {sortedItems.length === 0 ? (
        <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 rounded-md p-8 text-center">
          <p className="text-puzzle-white text-lg">No tasks found. Try adjusting your filters or synchronize project tasks.</p>
        </div>
      ) : (
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
            {sortedItems.map((item) => (
              <React.Fragment key={item.id}>
                <ProgressItemRow 
                  item={item} 
                  onToggleComments={toggleComments}
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
      )}
    </div>
  );
};
