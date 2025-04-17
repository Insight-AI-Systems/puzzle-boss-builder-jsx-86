
export class ProgressTestRunner {
  static testProgressItemOrder(items: any[], order: string[]): boolean {
    // Simple test to check if items are in the correct order based on their ids
    try {
      if (!items || !order || items.length !== order.length) {
        return false;
      }
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].id !== order[i]) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Progress item order test error:', error);
      return false;
    }
  }
}
