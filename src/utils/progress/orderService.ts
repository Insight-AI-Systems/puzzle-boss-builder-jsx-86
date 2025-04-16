
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
    
    // First, get existing items to preserve required fields
    const { data: existingItems, error: fetchError } = await supabase
      .from('progress_items')
      .select('id, title')
      .in('id', orderedItemIds);
      
    if (fetchError) {
      console.error('Error fetching existing items:', fetchError);
      return false;
    }
    
    if (!existingItems || existingItems.length !== orderedItemIds.length) {
      console.warn(`Only found ${existingItems?.length || 0} of ${orderedItemIds.length} items in database`);
      // Continue with the items we found rather than failing entirely
    }
    
    // Create a map of id to title for easy lookup
    const itemsMap = new Map(existingItems?.map(item => [item.id, item.title]) || []);
    
    // Update order_index for each item
    const currentTime = new Date().toISOString();
    const updates = orderedItemIds.map((id, index) => {
      const title = itemsMap.get(id);
      if (!title) {
        console.warn(`Could not find title for item id: ${id}`);
        return null;
      }
      
      return {
        id,
        title,
        order_index: index,
        updated_at: currentTime
      };
    }).filter(Boolean);

    if (updates.length === 0) {
      console.error('No valid items to update in database');
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

    console.log('Order successfully saved to database with', updates.length, 'items');
    return true;
  } catch (error) {
    console.error('Error in saveDatabaseOrder:', error);
    return false;
  }
};
