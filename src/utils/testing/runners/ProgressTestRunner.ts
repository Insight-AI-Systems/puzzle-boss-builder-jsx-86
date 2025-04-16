
import { supabase } from '@/integrations/supabase/client';

export class ProgressTestRunner {
  static async testProgressItemOrder(itemIds: string[]): Promise<boolean> {
    try {
      if (!itemIds || itemIds.length === 0) {
        console.error('No item IDs provided for order test');
        return false;
      }
      
      const { data, error } = await supabase
        .from('progress_items')
        .select('id')
        .in('id', itemIds);
        
      if (error) {
        console.error('Error fetching items for order test:', error);
        return false;
      }
      
      if (!data || data.length !== itemIds.length) {
        console.error(`Only found ${data?.length} of ${itemIds.length} items in database`);
        return false;
      }
      
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
        
        console.log('Progress item order test passed');
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
