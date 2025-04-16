
import { supabase } from "@/integrations/supabase/client";

export const fetchDatabaseOrder = async () => {
  try {
    console.log('Fetching order from database...');
    
    const { data: items, error } = await supabase
      .from('progress_items')
      .select('id, order_index, updated_at, title')
      .order('order_index', { ascending: true })
      .not('order_index', 'is', null);

    if (error) {
      console.error('Error loading order from database:', error);
      return null;
    }

    if (!items || items.length === 0) {
      console.log('No items with order_index found in database');
      return null;
    }

    const orderIds = items.map(item => item.id);
    const latestUpdate = Math.max(...items.map(item => new Date(item.updated_at).getTime()));
    
    console.log('Database order retrieved with', orderIds.length, 'items');
    console.log('Latest database update:', new Date(latestUpdate).toISOString());

    return {
      orderIds: orderIds,
      latestUpdate: latestUpdate
    };
  } catch (error) {
    console.error('Error in fetchDatabaseOrder:', error);
    return null;
  }
};

export const saveDatabaseOrder = async (orderedItemIds: string[]) => {
  try {
    if (!orderedItemIds || !Array.isArray(orderedItemIds) || orderedItemIds.length === 0) {
      console.error('Invalid order data provided for database save');
      return false;
    }
    
    console.log('Saving order to database:', orderedItemIds.length, 'items');
    
    // Fetch existing items to get current order_index values
    const { data: existingItems, error: fetchError } = await supabase
      .from('progress_items')
      .select('id, title, status, priority, description, order_index')
      .in('id', orderedItemIds);
      
    if (fetchError) {
      console.error('Error fetching existing items:', fetchError);
      return false;
    }
    
    if (!existingItems || existingItems.length !== orderedItemIds.length) {
      console.warn(`Only found ${existingItems?.length || 0} of ${orderedItemIds.length} items in database`);
      // Continue with the items we found rather than failing entirely
    }
    
    // Create a map of id to existing item data
    const itemsMap = new Map(existingItems?.map(item => [item.id, item]) || []);
    
    // Prepare the updates by comparing old and new positions
    const currentTime = new Date().toISOString();
    const updates = [];
    
    for (let newIndex = 0; newIndex < orderedItemIds.length; newIndex++) {
      const id = orderedItemIds[newIndex];
      const item = itemsMap.get(id);
      
      if (!item) {
        console.warn(`Could not find item data for id: ${id}`);
        continue;
      }
      
      // Only update items whose order has changed
      if (item.order_index !== newIndex) {
        updates.push({
          id: id,
          title: item.title,
          status: item.status,
          priority: item.priority,
          description: item.description,
          order_index: newIndex,
          updated_at: currentTime
        });
        console.log(`Updating item ${item.title} from order ${item.order_index} to ${newIndex}`);
      }
    }

    if (updates.length === 0) {
      console.log('No order changes detected, skipping database update');
      return true; // Consider this a success, as the order is already correct
    }

    console.log(`Updating ${updates.length} items with new order indices`);

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

    console.log('Order successfully saved to database with', updates.length, 'updated items');
    return true;
  } catch (error) {
    console.error('Error in saveDatabaseOrder:', error);
    return false;
  }
};
