
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
import { ProgressItem } from '@/types/progressTypes';
import { DraggableTableRow } from './DraggableTableRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Save } from 'lucide-react';

interface DraggableProgressTableProps {
  items: ProgressItem[];
  onUpdateItemsOrder: (itemIds: string[]) => Promise<boolean>;
}

export function DraggableProgressTable({ items, onUpdateItemsOrder }: DraggableProgressTableProps) {
  const [sortedItems, setSortedItems] = useState<ProgressItem[]>([...items]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isUpdating) {
      setSortedItems([...items]);
    }
  }, [items, isUpdating]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      console.log('Drag ended but no change needed');
      return;
    }

    if (isUpdating) {
      console.log('Ignoring drag - update in progress');
      toast({
        variant: "destructive",
        title: "Please wait",
        description: "Another update is in progress",
        duration: 2000,
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      const oldIndex = sortedItems.findIndex(item => item.id === active.id);
      const newIndex = sortedItems.findIndex(item => item.id === over.id);
      
      if (oldIndex === -1 || newIndex === -1) {
        console.error('Could not find dragged items');
        setIsUpdating(false);
        return;
      }

      const updatedItems = arrayMove(sortedItems, oldIndex, newIndex);
      const movedItem = sortedItems[oldIndex];
      
      console.log('Reordered task:', movedItem.title);
      console.log(`From index ${oldIndex} to ${newIndex}`);
      
      setSortedItems(updatedItems);
      
      const itemIds = updatedItems.map(item => item.id);
      const success = await onUpdateItemsOrder(itemIds);
      
      if (success) {
        toast({
          title: "Order Saved",
          description: `Moved "${movedItem.title}" ${oldIndex > newIndex ? 'up' : 'down'} the list`,
          icon: <Save className="h-4 w-4" />,
          className: "bg-green-800 border-green-900 text-white",
          duration: 3000,
        });
      } else {
        throw new Error('Failed to save new order');
      }
    } catch (error) {
      console.error('Error during drag end:', error);
      setSortedItems([...items]);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save the new order. Please try again.",
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
