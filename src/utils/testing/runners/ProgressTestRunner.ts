
import { supabase } from '@/integrations/supabase/client';

export class ProgressTestRunner {
  static async testProgressItemOrder(itemIds: string[]): Promise<boolean> {
    try {
      if (!itemIds || itemIds.length === 0) {
        console.error('No item IDs provided for order test');
        return false;
      }
      
      // Verify items exist in the database and check their order
      const { data: dbItems, error } = await supabase
        .from('progress_items')
        .select('id, order_index, updated_at')
        .in('id', itemIds)
        .order('order_index', { ascending: true });
        
      if (error) {
        console.error('Error fetching items for order test:', error);
        return false;
      }
      
      if (!dbItems || dbItems.length !== itemIds.length) {
        console.error(`Only found ${dbItems?.length} of ${itemIds.length} items in database`);
        return false;
      }

      // Get the most recent update timestamp from database
      const latestDbUpdate = Math.max(...dbItems.map(item => 
        new Date(item.updated_at).getTime()
      ));

      // Check database order matches expected order
      const databaseOrder = dbItems.map(item => item.id);
      const databaseOrderMatches = itemIds.every((id, index) => databaseOrder[index] === id);
      
      if (!databaseOrderMatches) {
        console.error('Database order does not match expected order');
        return false;
      }
      
      // Check localStorage
      const savedOrderStr = localStorage.getItem('progressItemsOrder');
      const savedTimeStr = localStorage.getItem('progressItemsOrderTimestamp');
      
      if (!savedOrderStr || !savedTimeStr) {
        console.error('No saved order or timestamp found in localStorage');
        return false;
      }
      
      try {
        const savedOrder = JSON.parse(savedOrderStr);
        const savedTimestamp = parseInt(savedTimeStr, 10);
        
        if (!Array.isArray(savedOrder) || savedOrder.length === 0) {
          console.error('Invalid saved order format in localStorage');
          return false;
        }

        // Check if localStorage timestamp is older than database
        if (savedTimestamp < latestDbUpdate) {
          console.error('localStorage order is outdated compared to database');
          return false;
        }
        
        // Check that saved order matches the order of IDs
        const localStorageMatches = itemIds.every((id, index) => savedOrder[index] === id);
        if (!localStorageMatches) {
          console.error('localStorage order does not match expected order');
          return false;
        }
        
        console.log('Progress item order test passed for both database and localStorage');
        return true;
      } catch (e) {
        console.error('Error parsing saved order from localStorage:', e);
        return false;
      }
    } catch (error) {
      console.error('Progress item order test error:', error);
      return false;
    }
  }
}
