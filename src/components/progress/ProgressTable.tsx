
import React, { useState } from 'react';
import { ProgressItem } from '@/hooks/useProgressItems';
import { TableFilters } from './TableFilters';
import { TableContent } from './TableContent';

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

  const resetFilters = () => {
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
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

  return (
    <div className="space-y-4">
      <TableFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        resetFilters={resetFilters}
        itemCount={sortedItems.length}
      />
      
      <TableContent
        items={sortedItems}
        expandedItems={expandedItems}
        onToggleComments={toggleComments}
        onAddComment={onAddComment}
        onUpdateStatus={onUpdateStatus}
        onUpdatePriority={onUpdatePriority}
      />
    </div>
  );
};
