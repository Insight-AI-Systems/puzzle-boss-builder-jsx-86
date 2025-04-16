
import React, { useState, useEffect } from 'react';
import { ProgressItem } from '@/hooks/useProgressItems';
import { TableFilters } from './TableFilters';
import { DraggableProgressTable } from './DraggableProgressTable';
import { TableContent } from './TableContent';
import { Button } from '@/components/ui/button';
import { MoveVertical, List } from 'lucide-react';

interface ProgressTableProps {
  items: ProgressItem[];
  onAddComment: (content: string, itemId: string) => Promise<boolean>;
  onUpdateStatus: (itemId: string, status: string) => Promise<boolean>;
  onUpdatePriority: (itemId: string, priority: string) => Promise<boolean>;
}

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1
};

export const ProgressTable: React.FC<ProgressTableProps> = ({ 
  items, 
  onAddComment,
  onUpdateStatus,
  onUpdatePriority
}) => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<'date' | 'priority'>('date');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Persist drag mode in localStorage
  const [isDragMode, setIsDragMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('progressTableDragMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Update localStorage when drag mode changes
  useEffect(() => {
    localStorage.setItem('progressTableDragMode', JSON.stringify(isDragMode));
  }, [isDragMode]);

  const resetFilters = () => {
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
    setSortField('date');
    setSortOrder('desc');
  };

  const filteredAndSortedItems = [...items]
    .filter(item => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (priorityFilter && item.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'priority') {
        const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - 
                           priorityOrder[a.priority as keyof typeof priorityOrder];
        return sortOrder === 'desc' ? priorityDiff : -priorityDiff;
      } else {
        const dateA = new Date(sortOrder === 'desc' ? a.created_at : b.created_at);
        const dateB = new Date(sortOrder === 'desc' ? b.created_at : a.created_at);
        return dateB.getTime() - dateA.getTime();
      }
    });

  const handleToggleComments = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleDragMode = () => {
    setIsDragMode(!isDragMode);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TableFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          sortField={sortField}
          setSortField={setSortField}
          resetFilters={resetFilters}
          itemCount={filteredAndSortedItems.length}
        />
        <Button 
          variant="outline" 
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
          onClick={toggleDragMode}
        >
          {isDragMode ? <List className="mr-2 h-4 w-4" /> : <MoveVertical className="mr-2 h-4 w-4" />}
          {isDragMode ? "View Details" : "Drag & Sort"}
        </Button>
      </div>
      
      {isDragMode ? (
        <DraggableProgressTable
          items={filteredAndSortedItems}
          onUpdatePriority={onUpdatePriority}
        />
      ) : (
        <TableContent
          items={filteredAndSortedItems}
          expandedItems={expandedItems}
          onToggleComments={handleToggleComments}
          onAddComment={onAddComment}
          onUpdateStatus={onUpdateStatus}
          onUpdatePriority={onUpdatePriority}
        />
      )}
    </div>
  );
};
