import React, { useState } from 'react';
import { ProgressItem } from '@/hooks/useProgressItems';
import { TableFilters } from './TableFilters';
import { DraggableProgressTable } from './DraggableProgressTable';
import { TableContent } from './TableContent';

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

  return (
    <div className="space-y-4">
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
      
      <TableContent
        items={filteredAndSortedItems}
        expandedItems={expandedItems}
        onToggleComments={handleToggleComments}
        onAddComment={onAddComment}
        onUpdateStatus={onUpdateStatus}
        onUpdatePriority={onUpdatePriority}
      />
    </div>
  );
};
