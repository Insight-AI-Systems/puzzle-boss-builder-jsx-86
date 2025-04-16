
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
    
    console.log('Saving order to database immediately:', orderedItemIds.length, 'items');
    console.log('First few items in order:', orderedItemIds.slice(0, 3));
    
    // Update each item individually with its new order_index
    const updates = [];
    
    for (let i = 0; i < orderedItemIds.length; i++) {
      updates.push({
        id: orderedItemIds[i],
        order_index: i,
        updated_at: new Date().toISOString()
      });
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
    
    // Double-check that updates were saved
    const { data: checkItems, error: checkError } = await supabase
      .from('progress_items')
      .select('id, order_index')
      .in('id', orderedItemIds.slice(0, 3))
      .order('order_index', { ascending: true });
      
    if (checkError) {
      console.error('Error checking saved order:', checkError);
    } else {
      console.log('Sample of saved items in database:', checkItems);
    }

    console.log('Order successfully saved to database with', updates.length, 'updated items');
    return true;
  } catch (error) {
    console.error('Error in saveDatabaseOrder:', error);
    return false;
  }
};
