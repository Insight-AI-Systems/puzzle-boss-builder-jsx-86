
import { supabase } from "@/integrations/supabase/client";

export const fetchDatabaseOrder = async () => {
  try {
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

    // Log the retrieved order for debugging
    console.log('Database order retrieved:', items.map(i => ({ id: i.id, title: i.title, order: i.order_index })));

    return {
      orderIds: items.map(item => item.id),
      latestUpdate: Math.max(...items.map(item => new Date(item.updated_at).getTime()))
    };
  } catch (error) {
    console.error('Error in fetchDatabaseOrder:', error);
    return null;
  }
};

export const saveDatabaseOrder = async (orderedItemIds: string[]) => {
  try {
    console.log('Saving order to database:', orderedItemIds);
    
    // First, get existing items to preserve required fields
    const { data: existingItems, error: fetchError } = await supabase
      .from('progress_items')
      .select('id, title')
      .in('id', orderedItemIds);
      
    if (fetchError || !existingItems || existingItems.length === 0) {
      console.error('Error fetching existing items:', fetchError);
      return false;
    }
    
    // Create a map of id to title for easy lookup
    const itemsMap = new Map(existingItems.map(item => [item.id, item.title]));
    
    // Update order_index for each item
    const updates = orderedItemIds.map((id, index) => {
      const title = itemsMap.get(id);
      if (!title) {
        console.error(`Could not find title for item id: ${id}`);
        return null;
      }
      
      return {
        id,
        title,
        order_index: index,
        updated_at: new Date().toISOString()
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

    console.log('Order successfully saved to database');
    return true;
  } catch (error) {
    console.error('Error in saveDatabaseOrder:', error);
    return false;
  }
};
