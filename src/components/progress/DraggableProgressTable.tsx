import React, { useState, useEffect } from 'react';
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
import { useToast } from "@/hooks/use-toast";

interface DraggableProgressTableProps {
  items: ProgressItem[];
  onUpdateItemsOrder: (itemIds: string[]) => Promise<boolean>;
}

export function DraggableProgressTable({ items, onUpdateItemsOrder }: DraggableProgressTableProps) {
  const [sortedItems, setSortedItems] = useState(items);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  // Update sorted items when the items prop changes
  useEffect(() => {
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

    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      // First update local state for immediate UI feedback
      setSortedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      
      // Prepare the reordered items list
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedItems.findIndex((item) => item.id === over.id);
      const reorderedItems = arrayMove([...sortedItems], oldIndex, newIndex);
      const itemIds = reorderedItems.map(item => item.id);
      
      // Save the new order immediately
      await onUpdateItemsOrder(itemIds);

    } catch (error) {
      console.error("Error during drag end:", error);
      setSortedItems(items);
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: "An error occurred while updating the order.",
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
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
