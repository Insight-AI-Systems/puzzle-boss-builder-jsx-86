
import { useQueryClient } from "@tanstack/react-query";
import { useProgressSync } from "./useProgressSync";
import { addCommentToItem } from "@/utils/progress/commentOperations";
import { updateItemStatus, updateItemPriority } from "@/utils/progress/statusOperations";
import { useItemOrder } from "./useItemOrder";
import { useFetchItems } from "./useFetchItems";

export function useProgressItems() {
  const queryClient = useQueryClient();
  const { isSyncing, syncTasks } = useProgressSync();
  const { savedOrder, updateItemsOrder, loaded, isSaving } = useItemOrder();
  const { data: items, isLoading } = useFetchItems(loaded ? savedOrder : []);

  const addComment = async (content: string, itemId: string) => {
    const success = await addCommentToItem(content, itemId);
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ['progress-items'] });
    }
    return success;
  };

  const handleUpdateItemStatus = async (itemId: string, status: string) => {
    const success = await updateItemStatus(itemId, status);
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ['progress-items'] });
    }
    return success;
  };

  const handleUpdateItemPriority = async (itemId: string, priority: string) => {
    console.log(`Updating priority for item ${itemId} to ${priority}`);
    const success = await updateItemPriority(itemId, priority);
    if (success) {
      console.log(`Successfully updated priority for item ${itemId}`);
      await queryClient.invalidateQueries({ queryKey: ['progress-items'] });
    } else {
      console.error(`Failed to update priority for item ${itemId}`);
    }
    return success;
  };

  const handleUpdateItemsOrder = async (itemIds: string[]) => {
    console.log("useProgressItems: Updating order of items", itemIds.length, "items");
    const success = await updateItemsOrder(itemIds);
    if (success) {
      console.log("Order updated successfully, invalidating queries");
      // Use a short delay to ensure the database has time to update
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['progress-items'] });
      }, 300);
    }
    return success;
  };

  return {
    items,
    isLoading: isLoading || !loaded,
    isSyncing,
    isSavingOrder: isSaving,
    addComment,
    syncTasks,
    updateItemStatus: handleUpdateItemStatus,
    updateItemPriority: handleUpdateItemPriority,
    updateItemsOrder: handleUpdateItemsOrder
  };
}

export type { ProgressItem, ProgressComment } from '../types/progressTypes';
