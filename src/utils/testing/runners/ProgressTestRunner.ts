
import { supabase } from '@/integrations/supabase/client';

export class ProgressTestRunner {
  static async testProgressItemOrder(itemIds: string[]): Promise<boolean> {
    try {
      if (!itemIds || itemIds.length === 0) {
        console.error('No item IDs provided for order test');
        return false;
      }
      
      console.log('Testing progress item order for:', itemIds.length, 'items');
      
      // Verify items exist in the database and check their order
      const { data: dbItems, error } = await supabase
        .from('progress_items')
        .select('id, order_index, updated_at, title')
        .in('id', itemIds)
        .order('order_index', { ascending: true });
        
      if (error) {
        console.error('Error fetching items for order test:', error);
        return false;
      }
      
      if (!dbItems || dbItems.length === 0) {
        console.error('No items found in database for order test');
        return false;
      }

      if (dbItems.length !== itemIds.length) {
        console.warn(`Only found ${dbItems?.length} of ${itemIds.length} items in database`);
        // Continue with validation for the items we found
      }

      console.log('Database items retrieved for validation:', dbItems.length);

      // Get the most recent update timestamp from database
      const latestDbUpdate = Math.max(...dbItems.map(item => 
        new Date(item.updated_at).getTime()
      ));

      // Check localStorage for timestamps
      const savedOrderStr = localStorage.getItem('progressItemsOrder');
      const savedTimeStr = localStorage.getItem('progressItemsOrderTimestamp');
      
      if (!savedOrderStr || !savedTimeStr) {
        // If no localStorage data exists, database order is authoritative
        console.log('No localStorage data found, validating database order only');
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

        // Verify both localStorage and database orders
        const localStorageValid = this.verifyLocalStorageOrder(savedOrder, itemIds);
        const databaseValid = this.verifyDatabaseOrder(dbItems, itemIds);
        
        // Both sources should be consistent with the expected order
        return localStorageValid && databaseValid;
        
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
    // Create map of database items for efficient lookup
    const dbItemMap = new Map(dbItems.map(item => [item.id, item.order_index]));
    
    // Verify that items are ordered correctly based on order_index
    let previousIndex = -1;
    for (const id of expectedOrder) {
      if (!dbItemMap.has(id)) {
        console.warn(`Item ${id} not found in database order`);
        continue;
      }
      
      const currentIndex = dbItemMap.get(id);
      if (currentIndex <= previousIndex) {
        console.error(`Database order inconsistency: item ${id} has index ${currentIndex} but should be greater than ${previousIndex}`);
        return false;
      }
      
      previousIndex = currentIndex;
    }
    
    console.log('Database order verification passed');
    return true;
  }

  private static verifyLocalStorageOrder(savedOrder: string[], expectedOrder: string[]): boolean {
    // Check that the orders match exactly (same items in same order)
    if (savedOrder.length !== expectedOrder.length) {
      console.error('localStorage order length mismatch');
      return false;
    }
    
    for (let i = 0; i < expectedOrder.length; i++) {
      if (savedOrder[i] !== expectedOrder[i]) {
        console.error(`localStorage order mismatch at position ${i}`);
        return false;
      }
    }
    
    console.log('localStorage order verification passed');
    return true;
  }
}
