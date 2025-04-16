
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
import { TestRunner } from '@/utils/testRunner';
import { Check } from 'lucide-react';

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
    toast({
      title: "Updating order...",
      description: "Saving your changes...",
    });

    try {
      // First update local state for immediate UI feedback
      setSortedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      
      // Then prepare the reordered items list
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedItems.findIndex((item) => item.id === over.id);
      const reorderedItems = arrayMove([...sortedItems], oldIndex, newIndex);
      
      // Get just the IDs for updating the order
      const itemIds = reorderedItems.map(item => item.id);
      
      // Save the new order
      const success = await onUpdateItemsOrder(itemIds);
      
      if (success) {
        const persistenceVerified = await TestRunner.testProgressItemOrder(itemIds);
        
        if (persistenceVerified) {
          toast({
            title: "Tasks reordered",
            description: "The task order has been successfully updated and verified",
            className: "bg-green-800 border-green-900 text-white",
          });
        } else {
          // Even if verification fails, don't revert UI if the update succeeded
          toast({
            title: "Order saved",
            description: "The order was saved but verification had issues. The order should still persist.",
            className: "bg-green-800 border-green-900 text-white",
          });
        }
      } else {
        // Only revert the UI if the update definitely failed
        setSortedItems(items);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to save the new order. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during drag end:", error);
      setSortedItems(items);
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: "An error occurred while updating the order.",
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
