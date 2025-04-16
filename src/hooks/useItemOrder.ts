
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { fetchDatabaseOrder, saveDatabaseOrder } from '@/utils/progress/orderService';
import { getLocalStorageOrder, saveLocalStorageOrder } from '@/utils/progress/localStorageService';

export function useItemOrder() {
  const [savedOrder, setSavedOrder] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      
      console.log('Database order:', dbResult?.orderIds?.length || 0, 'items');
      console.log('LocalStorage order:', localResult?.orderIds?.length || 0, 'items');
      
      if (dbResult && localResult) {
        // Compare timestamps to decide which order to use
        console.log('Comparing timestamps: local =', new Date(localResult.timestamp).toISOString(), 
                    'db =', new Date(dbResult.latestUpdate).toISOString());
                    
        if (localResult.timestamp > dbResult.latestUpdate) {
          console.log('Using localStorage order (more recent)');
          setSavedOrder(localResult.orderIds);
          // Sync to database to ensure consistency
          await saveDatabaseOrder(localResult.orderIds);
        } else {
          console.log('Using database order');
          setSavedOrder(dbResult.orderIds);
          // Update localStorage with database order
          saveLocalStorageOrder(dbResult.orderIds);
        }
      } else if (dbResult) {
        console.log('Using database order (no localStorage)');
        setSavedOrder(dbResult.orderIds);
        saveLocalStorageOrder(dbResult.orderIds);
      } else if (localResult) {
        console.log('Using localStorage order (no database)');
        setSavedOrder(localResult.orderIds);
        // Sync to database
        await saveDatabaseOrder(localResult.orderIds);
      }
      
      setLoaded(true);
    } catch (err) {
      console.error('Error loading saved order:', err);
      setLoaded(true);
      
      // Try localStorage as fallback
      const localResult = getLocalStorageOrder();
      if (localResult) {
        setSavedOrder(localResult.orderIds);
        toast({
          title: "Fallback to local storage",
          description: "Using locally saved order due to database connection issue",
          duration: 3000,
        });
      }
    }
  };

  const updateItemsOrder = async (orderedItemIds: string[]) => {
    if (isSaving) {
      console.log('Already saving order, skipping duplicate save request');
      return true;
    }
    
    try {
      setIsSaving(true);
      console.log('Saving new order:', orderedItemIds.length, 'items');
      
      // Update state immediately
      setSavedOrder(orderedItemIds);
      
      // Save to localStorage first for immediate persistence
      saveLocalStorageOrder(orderedItemIds);
      
      // Then save to database for long-term persistence
      const success = await saveDatabaseOrder(orderedItemIds);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Database save failed",
          description: "Order saved locally but failed to save to database. Changes will be synced on next refresh.",
          duration: 5000,
        });
      }
      
      return true; // We've saved to localStorage even if database failed
    } catch (error) {
      console.error('Error in updateItemsOrder:', error);
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: error instanceof Error ? error.message : "An unknown error occurred while saving order",
        duration: 5000,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    savedOrder,
    updateItemsOrder,
    loaded,
    isSaving
  };
}
