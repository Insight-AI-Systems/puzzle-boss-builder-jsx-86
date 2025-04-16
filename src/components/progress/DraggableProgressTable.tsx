
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
  onUpdatePriority: (itemId: string, priority: string) => Promise<boolean>;
}

export function DraggableProgressTable({ items, onUpdatePriority }: DraggableProgressTableProps) {
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

  const saveOrderToLocalStorage = (items: ProgressItem[]) => {
    try {
      const itemIds = items.map(item => item.id);
      localStorage.setItem('progressItemsOrder', JSON.stringify(itemIds));
      console.log('Saved order to localStorage:', itemIds);
    } catch (err) {
      console.error('Error saving order to localStorage:', err);
    }
  };

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
      
      // Save the new order to localStorage
      saveOrderToLocalStorage(reorderedItems);
      
      // Update priorities based on new position
      const priorities = ['high', 'high', 'medium', 'medium', 'low'];
      
      // Create an array of promises for all update operations
      const updatePromises = reorderedItems.map(async (item, index) => {
        const newPriority = priorities[Math.min(index, priorities.length - 1)];
        if (newPriority !== item.priority) {
          console.log(`Updating item ${item.id} (${item.title}) priority from ${item.priority} to ${newPriority}`);
          return onUpdatePriority(item.id, newPriority);
        }
        return true;
      });
      
      // Wait for all updates to complete
      const results = await Promise.all(updatePromises);
      
      // Check if all updates were successful
      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        toast({
          title: "Priorities updated",
          description: "Task priorities have been successfully updated",
        });
      } else {
        console.error("Some priority updates failed");
        toast({
          variant: "destructive",
          title: "Update partially failed",
          description: "Some task priorities could not be updated. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating priorities:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update task priorities. Please try again.",
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
