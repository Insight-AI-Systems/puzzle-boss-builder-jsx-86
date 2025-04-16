
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
    useSensor(PointerSensor, {
      // Increase activation constraint to prevent accidental drags
      activationConstraint: {
        distance: 8, // Require a drag of at least 8px before activating
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      console.log('Drag ended but no change needed (same position or no target)');
      return;
    }

    if (isUpdating) {
      console.log('Ignoring drag operation - already updating');
      return;
    }

    setIsUpdating(true);
    // Show a small "Saving..." toast
    toast({
      title: "Auto-saving...",
      description: "Saving your task order",
      duration: 2000,
    });

    try {
      console.log(`Moving item from position with ID ${active.id} to position with ID ${over.id}`);
      
      // Find the actual indices in the current sortedItems array
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedItems.findIndex((item) => item.id === over.id);
      
      if (oldIndex === -1 || newIndex === -1) {
        console.error('Could not find dragged items in the sorted list', { 
          activeId: active.id, 
          overId: over.id,
          oldIndex,
          newIndex
        });
        setIsUpdating(false);
        return;
      }
      
      // Create a copy of the current items array
      const updatedItems = [...sortedItems];
      
      // Move just the dragged item to its new position
      const [movedItem] = updatedItems.splice(oldIndex, 1);
      updatedItems.splice(newIndex, 0, movedItem);
      
      console.log('Reordered just the dragged item:', movedItem.title);
      console.log('New positions:');
      updatedItems.forEach((item, index) => {
        console.log(`${index}: ${item.title}`);
      });
      
      // Update the local state with the updated order
      setSortedItems(updatedItems);
      
      // Get the item IDs for the new order
      const itemIds = updatedItems.map(item => item.id);
      
      // Save the new order immediately
      console.log("Auto-saving new item order:", itemIds);
      const success = await onUpdateItemsOrder(itemIds);
      
      if (success) {
        toast({
          title: "Order saved",
          description: "Your task order has been saved",
          className: "bg-green-800 border-green-900 text-white",
          duration: 2000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Failed to save the new order",
          duration: 3000,
        });
        // Revert to original order if save failed
        setSortedItems(items);
      }
    } catch (error) {
      console.error("Error during drag end:", error);
      setSortedItems(items);
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: "An error occurred while updating the order",
        duration: 3000,
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
            items={sortedItems.map(item => item.id)}
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

