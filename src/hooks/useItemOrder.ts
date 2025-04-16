
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { fetchDatabaseOrder, saveDatabaseOrder } from '@/utils/progress/orderService';
import { getLocalStorageOrder, saveLocalStorageOrder } from '@/utils/progress/localStorageService';

export function useItemOrder() {
  const [savedOrder, setSavedOrder] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedOrder();
  }, []);

  const loadSavedOrder = async () => {
    try {
      console.log('Loading saved order from database and localStorage...');
      
      // Get order from database
      const dbResult = await fetchDatabaseOrder();
      
      // Get order from localStorage
      const localResult = getLocalStorageOrder();
      
      if (dbResult && localResult) {
        // Compare timestamps to decide which order to use
        if (localResult.timestamp > dbResult.latestUpdate) {
          console.log('Using localStorage order (more recent)', localResult.orderIds);
          setSavedOrder(localResult.orderIds);
        } else {
          console.log('Using database order', dbResult.orderIds);
          setSavedOrder(dbResult.orderIds);
          // Update localStorage with database order
          saveLocalStorageOrder(dbResult.orderIds);
        }
      } else if (dbResult) {
        console.log('Using database order (no localStorage)', dbResult.orderIds);
        setSavedOrder(dbResult.orderIds);
        saveLocalStorageOrder(dbResult.orderIds);
      } else if (localResult) {
        console.log('Using localStorage order (no database)', localResult.orderIds);
        setSavedOrder(localResult.orderIds);
      }
      
      setLoaded(true);
      
      if (dbResult || localResult) {
        toast({
          title: "Order loaded",
          description: "Task order has been loaded successfully",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error('Error loading saved order:', err);
      const localResult = getLocalStorageOrder();
      if (localResult) {
        setSavedOrder(localResult.orderIds);
        toast({
          title: "Order loaded",
          description: "Task order has been loaded from local storage",
          duration: 3000,
        });
      }
      setLoaded(true);
    }
  };

  const updateItemsOrder = async (orderedItemIds: string[]) => {
    try {
      console.log('Saving new order:', orderedItemIds);
      
      // Save to localStorage
      saveLocalStorageOrder(orderedItemIds);
      setSavedOrder(orderedItemIds);
      
      // Save to database
      const success = await saveDatabaseOrder(orderedItemIds);
      
      if (success) {
        toast({
          title: "Order saved",
          description: "The new task order has been saved",
          duration: 3000,
          className: "bg-green-800 border-green-900 text-white",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Database save failed",
          description: "Failed to save to database, but changes are stored locally",
          duration: 5000,
        });
        return false;
      }
    } catch (error) {
      console.error('Error in updateItemsOrder:', error);
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        duration: 5000,
      });
      return false;
    }
  };

  return {
    savedOrder,
    updateItemsOrder,
    loaded
  };
}
