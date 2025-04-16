
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
import { toast } from "@/hooks/use-toast";

interface DraggableProgressTableProps {
  items: ProgressItem[];
  onUpdateItemsOrder: (itemIds: string[]) => Promise<boolean>;
}

export function DraggableProgressTable({ items, onUpdateItemsOrder }: DraggableProgressTableProps) {
  const [sortedItems, setSortedItems] = useState(items);
  const [isUpdating, setIsUpdating] = useState(false);

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

    // Prevent multiple simultaneous updates
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      // Update UI immediately for better user experience
      setSortedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      
      // Get the updated sorted items
      const newItems = [...sortedItems];
      const oldIndex = newItems.findIndex((item) => item.id === active.id);
      const newIndex = newItems.findIndex((item) => item.id === over.id);
      const reorderedItems = arrayMove(newItems, oldIndex, newIndex);
      
      console.log("Reordered items:", reorderedItems.map(item => ({id: item.id, title: item.title})));
      
      // Save reordered items to persistent storage
      const itemIds = reorderedItems.map(item => item.id);
      const success = await onUpdateItemsOrder(itemIds);
      
      if (!success) {
        // If update failed, revert the UI to match the data
        setSortedItems(items);
        
        console.error("Failed to update items order");
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to save the new order. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during drag end:", error);
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: "An error occurred while updating the order.",
      });
      
      // Revert UI on error
      setSortedItems(items);
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
