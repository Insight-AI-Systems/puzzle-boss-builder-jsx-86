
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TestRunner } from '@/utils/testRunner';

export function useItemOrder() {
  const [savedOrder, setSavedOrder] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedOrder();
  }, []);

  const loadSavedOrder = async () => {
    try {
      console.log('Loading saved order from database and localStorage...');
      
      // First try to load from database
      const { data: items, error } = await supabase
        .from('progress_items')
        .select('id, order_index, updated_at, title')
        .order('order_index', { ascending: true })
        .not('order_index', 'is', null);

      if (error) {
        console.error('Error loading order from database:', error);
        // Try fallback to localStorage
        fallbackToLocalStorage();
        return;
      }

      const localStorageOrder = localStorage.getItem('progressItemsOrder');
      const localStorageTimestamp = localStorage.getItem('progressItemsOrderTimestamp');
      
      if (items && items.length > 0) {
        console.log(`Found ${items.length} items with order_index in database`);
        const orderFromDb = items.map(item => item.id);
        const latestDbUpdate = Math.max(...items.map(item => 
          new Date(item.updated_at).getTime()
        ));

        // If localStorage exists, compare timestamps
        if (localStorageOrder && localStorageTimestamp) {
          const savedTimestamp = parseInt(localStorageTimestamp, 10);
          
          console.log('Comparing timestamps:', {
            localStorage: new Date(savedTimestamp).toISOString(),
            database: new Date(latestDbUpdate).toISOString()
          });
          
          if (savedTimestamp > latestDbUpdate) {
            // localStorage is more recent, use it
            console.log('Using localStorage order (more recent)');
            setSavedOrder(JSON.parse(localStorageOrder));
            return;
          }
        }

        // Use database order and update localStorage
        console.log('Using database order and updating localStorage');
        setSavedOrder(orderFromDb);
        localStorage.setItem('progressItemsOrder', JSON.stringify(orderFromDb));
        localStorage.setItem('progressItemsOrderTimestamp', Date.now().toString());
        
        toast({
          title: "Order loaded",
          description: "Task order has been loaded from database",
          duration: 3000,
        });
        
        return;
      } else {
        console.log('No items with order_index found in database');
      }

      // Fallback to localStorage if no order in database
      fallbackToLocalStorage();
    } catch (err) {
      console.error('Error loading saved order:', err);
      fallbackToLocalStorage();
    }
  };

  const fallbackToLocalStorage = () => {
    const localStorageOrder = localStorage.getItem('progressItemsOrder');
    if (localStorageOrder) {
      console.log('Falling back to localStorage order');
      setSavedOrder(JSON.parse(localStorageOrder));
      toast({
        title: "Order loaded",
        description: "Task order has been loaded from local storage",
        duration: 3000,
      });
    } else {
      console.log('No saved order found in localStorage');
    }
  };

  const saveOrderToDB = async (orderedItemIds: string[]) => {
    try {
      console.log('Saving order to database:', orderedItemIds);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to save item order to database",
          duration: 5000,
        });
        return false;
      }

      // First, get existing items to preserve required fields
      const { data: existingItems, error: fetchError } = await supabase
        .from('progress_items')
        .select('id, title')
        .in('id', orderedItemIds);
        
      if (fetchError) {
        console.error('Error fetching existing items:', fetchError);
        return false;
      }
      
      if (!existingItems || existingItems.length === 0) {
        console.error('No existing items found to update');
        return false;
      }
      
      // Create a map of id to title for easy lookup
      const itemsMap = new Map(existingItems.map(item => [item.id, item.title]));
      
      // Update order_index for each item using upsert with all required fields
      const updates = orderedItemIds.map((id, index) => {
        const title = itemsMap.get(id);
        if (!title) {
          console.error(`Could not find title for item id: ${id}`);
          return null;
        }
        
        return {
          id,
          title, // Include required title field
          order_index: index,
          updated_at: new Date().toISOString() // Explicitly update timestamp
        };
      }).filter(item => item !== null);

      if (updates.length !== orderedItemIds.length) {
        console.error('Some items could not be prepared for update');
        return false;
      }

      const { error } = await supabase
        .from('progress_items')
        .upsert(updates, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error saving order to database:', error);
        return false;
      }

      console.log('Order saved successfully to database');
      return true;
    } catch (error) {
      console.error('Error saving order to database:', error);
      return false;
    }
  };

  const updateItemsOrder = async (newOrder: string[]) => {
    try {
      console.log('Saving new order to localStorage and database:', newOrder);
      
      // Save to localStorage with timestamp
      const timestamp = Date.now();
      localStorage.setItem('progressItemsOrder', JSON.stringify(newOrder));
      localStorage.setItem('progressItemsOrderTimestamp', timestamp.toString());
      setSavedOrder(newOrder);
      
      // Attempt to save to database
      const success = await saveOrderToDB(newOrder);
      
      if (success) {
        // Verify that the order was actually saved using TestRunner
        const persistenceVerified = await TestRunner.testProgressItemOrder(newOrder);
        
        if (persistenceVerified) {
          toast({
            title: "Order saved",
            description: "The new task order has been saved and verified in both local storage and database",
            duration: 3000,
            className: "bg-green-800 border-green-900 text-white",
          });
          return true;
        } else {
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: "The order was saved but could not be verified. Please check the console.",
            duration: 5000,
          });
          return false;
        }
      } else {
        toast({
          variant: "destructive",
          title: "Database save failed",
          description: "Failed to save to database, but changes are stored locally.",
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
    updateItemsOrder
  };
}
