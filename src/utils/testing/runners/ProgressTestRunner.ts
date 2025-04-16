
import { supabase } from '@/integrations/supabase/client';

export class ProgressTestRunner {
  static async testProgressItemOrder(itemIds: string[]): Promise<boolean> {
    try {
      if (!itemIds || itemIds.length === 0) {
        console.error('No item IDs provided for order test');
        return false;
      }
      
      console.log('Testing progress item order for:', itemIds);
      
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

      console.log('Database items retrieved:', dbItems.map(d => ({id: d.id, order: d.order_index})));

      // Get the most recent update timestamp from database
      const latestDbUpdate = Math.max(...dbItems.map(item => 
        new Date(item.updated_at).getTime()
      ));

      // Check localStorage for timestamps
      const savedOrderStr = localStorage.getItem('progressItemsOrder');
      const savedTimeStr = localStorage.getItem('progressItemsOrderTimestamp');
      
      if (!savedOrderStr || !savedTimeStr) {
        // If no localStorage data exists, database order is authoritative
        console.log('No localStorage data found, using database order');
        return this.verifyDatabaseOrder(dbItems, itemIds);
      }
      
      try {
        const savedOrder = JSON.parse(savedOrderStr);
        const savedTimestamp = parseInt(savedTimeStr, 10);
        
        if (!Array.isArray(savedOrder) || savedOrder.length === 0) {
          console.error('Invalid saved order format in localStorage');
          return false;
        }

        console.log('Comparing timestamps:', {
          localStorage: new Date(savedTimestamp).toISOString(),
          database: new Date(latestDbUpdate).toISOString()
        });

        // Compare timestamps to determine which order to use
        if (savedTimestamp > latestDbUpdate) {
          console.log('localStorage order is more recent, using localStorage order');
          return this.verifyLocalStorageOrder(savedOrder, itemIds);
        } else {
          console.log('Database order is more recent, using database order');
          return this.verifyDatabaseOrder(dbItems, itemIds);
        }
        
      } catch (e) {
        console.error('Error parsing saved order from localStorage:', e);
        return false;
      }
    } catch (error) {
      console.error('Progress item order test error:', error);
      return false;
    }
  }

  private static verifyDatabaseOrder(dbItems: any[], expectedOrder: string[]): boolean {
    const databaseOrder = dbItems.map(item => item.id);
    console.log('Verifying database order:', {
      expected: expectedOrder,
      actual: databaseOrder
    });
    
    const orderMatches = expectedOrder.every((id, index) => databaseOrder[index] === id);
    
    if (!orderMatches) {
      console.error('Database order does not match expected order');
      return false;
    }
    
    console.log('Database order verification passed');
    return true;
  }

  private static verifyLocalStorageOrder(savedOrder: string[], expectedOrder: string[]): boolean {
    console.log('Verifying localStorage order:', {
      expected: expectedOrder,
      actual: savedOrder
    });
    
    const orderMatches = expectedOrder.every((id, index) => savedOrder[index] === id);
    
    if (!orderMatches) {
      console.error('localStorage order does not match expected order');
      return false;
    }
    
    console.log('localStorage order verification passed');
    return true;
  }
}
