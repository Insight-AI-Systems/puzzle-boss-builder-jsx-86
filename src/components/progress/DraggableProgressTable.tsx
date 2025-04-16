
import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ProgressItem } from '@/hooks/useProgressItems';
import { DraggableTableRow } from './DraggableTableRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DraggableProgressTableProps {
  items: ProgressItem[];
  onUpdatePriority: (itemId: string, priority: string) => Promise<boolean>;
}

export function DraggableProgressTable({ items, onUpdatePriority }: DraggableProgressTableProps) {
  const [sortedItems, setSortedItems] = React.useState(items);

  React.useEffect(() => {
    setSortedItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    setSortedItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Update priorities based on new position
      const priorities = ['high', 'high', 'medium', 'medium', 'low'];
      newItems.forEach(async (item, index) => {
        const newPriority = priorities[Math.min(index, priorities.length - 1)];
        if (newPriority !== item.priority) {
          await onUpdatePriority(item.id, newPriority);
        }
      });
      
      return newItems;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
          <SortableContext
            items={sortedItems}
            strategy={verticalListSortingStrategy}
          >
            {sortedItems.map((item) => (
              <DraggableTableRow key={item.id} item={item} />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
