import React from 'react';
import { ProgressItem } from '@/hooks/useProgressItems';
import { TableFilters } from './TableFilters';
import { DraggableProgressTable } from './DraggableProgressTable';

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
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);

  const resetFilters = () => {
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
  };

  const filteredItems = items.filter(item => {
    if (statusFilter && item.status !== statusFilter) return false;
    if (priorityFilter && item.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <TableFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        resetFilters={resetFilters}
        itemCount={filteredItems.length}
      />
      
      <DraggableProgressTable
        items={filteredItems}
        onUpdatePriority={onUpdatePriority}
      />
    </div>
  );
};
