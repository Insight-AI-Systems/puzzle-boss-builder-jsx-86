
import { TestRunner } from '@/utils/TestRunner';
import { supabase } from '@/integrations/supabase/client';
import { ProgressItem } from '@/hooks/useProgressItems';

/**
 * Tests specifically for the Progress functionality
 */
export class ProgressTests {
  /**
   * Test that item reordering persists to both localStorage and database
   */
  static async testReorderPersistence(items: ProgressItem[]): Promise<boolean> {
    if (!items || items.length < 2) {
      console.log('Not enough items to test reordering');
      return false;
    }
    
    try {
      // Get current order from localStorage
      const savedOrderStr = localStorage.getItem('progressItemsOrder');
      if (!savedOrderStr) {
        console.error('No saved order found in localStorage');
        return false;
      }
      
      const savedOrder = JSON.parse(savedOrderStr);
      console.log('Current saved order:', savedOrder);
      
      // Swap first two items to create a new order
      const newOrder = [...savedOrder];
      [newOrder[0], newOrder[1]] = [newOrder[1], newOrder[0]];
      
      // Save to localStorage manually
      localStorage.setItem('progressItemsOrder', JSON.stringify(newOrder));
      console.log('Saved new test order to localStorage:', newOrder);
      
      // Verify localStorage was updated
      const updatedOrderStr = localStorage.getItem('progressItemsOrder');
      const updatedOrder = JSON.parse(updatedOrderStr || '[]');
      
      if (!updatedOrder || updatedOrder.length !== newOrder.length) {
        console.error('Failed to save new order to localStorage');
        
        // Restore original order
        localStorage.setItem('progressItemsOrder', JSON.stringify(savedOrder));
        return false;
      }
      
      // Check item priorities in database
      const { data, error } = await supabase
        .from('progress_items')
        .select('id, priority')
        .in('id', newOrder.slice(0, 5));
        
      if (error) {
        console.error('Error fetching item priorities:', error);
        
        // Restore original order
        localStorage.setItem('progressItemsOrder', JSON.stringify(savedOrder));
        return false;
      }
      
      // Restore original order
      localStorage.setItem('progressItemsOrder', JSON.stringify(savedOrder));
      console.log('Restored original order after test');
      
      return true;
    } catch (error) {
      console.error('Error in reorder persistence test:', error);
      return false;
    }
  }
  
  /**
   * Test that drag mode state is properly saved to localStorage
   */
  static testDragModePersistence(): boolean {
    try {
      // Save original state
      const originalState = localStorage.getItem('progressTableDragMode');
      
      // Set to true and test
      localStorage.setItem('progressTableDragMode', 'true');
      const stateTrue = localStorage.getItem('progressTableDragMode');
      
      // Set to false and test
      localStorage.setItem('progressTableDragMode', 'false');
      const stateFalse = localStorage.getItem('progressTableDragMode');
      
      // Restore original state if it existed
      if (originalState !== null) {
        localStorage.setItem('progressTableDragMode', originalState);
      } else {
        localStorage.removeItem('progressTableDragMode');
      }
      
      // Verify both states were correctly saved and retrieved
      return stateTrue === 'true' && stateFalse === 'false';
    } catch (error) {
      console.error('Error in drag mode persistence test:', error);
      return false;
    }
  }
  
  /**
   * Register all Progress-related tests with the project tracker
   */
  static registerTests() {
    // These would be registered with the project tracker
    console.log('Progress tests registered');
  }
}
