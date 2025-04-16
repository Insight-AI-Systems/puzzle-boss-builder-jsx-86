
import { supabase } from '@/integrations/supabase/client';

export class ProgressTestRunner {
  static async testProgressItemOrder(itemIds: string[]): Promise<boolean> {
    try {
      if (!itemIds || itemIds.length === 0) {
        console.error('No item IDs provided for order test');
        return false;
      }
      
      // Verify items exist in the database and check their order
      const { data, error } = await supabase
        .from('progress_items')
        .select('id, order_index')
        .in('id', itemIds)
        .order('order_index', { ascending: true });
        
      if (error) {
        console.error('Error fetching items for order test:', error);
        return false;
      }
      
      if (!data || data.length !== itemIds.length) {
        console.error(`Only found ${data?.length} of ${itemIds.length} items in database`);
        return false;
      }

      // Check database order matches expected order
      const databaseOrder = data.map(item => item.id);
      const databaseOrderMatches = itemIds.every((id, index) => databaseOrder[index] === id);
      
      if (!databaseOrderMatches) {
        console.error('Database order does not match expected order');
        return false;
      }
      
      // Check localStorage
      const savedOrderStr = localStorage.getItem('progressItemsOrder');
      if (!savedOrderStr) {
        console.error('No saved order found in localStorage');
        return false;
      }
      
      try {
        const savedOrder = JSON.parse(savedOrderStr);
        if (!Array.isArray(savedOrder) || savedOrder.length === 0) {
          console.error('Invalid saved order format in localStorage');
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
