const ORDER_KEY = 'progressItemsOrder';
const TIMESTAMP_KEY = 'progressItemsOrderTimestamp';

export const getLocalStorageOrder = () => {
  try {
    const savedOrderStr = localStorage.getItem(ORDER_KEY);
    const savedTimeStr = localStorage.getItem(TIMESTAMP_KEY);
    
    if (!savedOrderStr || !savedTimeStr) {
      console.log('No saved order found in localStorage');
      return null;
    }
    
    const savedOrder = JSON.parse(savedOrderStr);
    const savedTimestamp = parseInt(savedTimeStr, 10);
    
    if (!Array.isArray(savedOrder) || savedOrder.length === 0) {
      console.error('Invalid saved order format in localStorage');
      localStorage.removeItem(ORDER_KEY);
      localStorage.removeItem(TIMESTAMP_KEY);
      return null;
    }
    
    console.log('Retrieved order from localStorage with', savedOrder.length, 'items');
    console.log('Order timestamp:', new Date(savedTimestamp).toISOString());
    
    return {
      orderIds: savedOrder,
      timestamp: savedTimestamp
    };
  } catch (e) {
    console.error('Error parsing saved order from localStorage:', e);
    // Clear potentially corrupted data
    localStorage.removeItem(ORDER_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
    return null;
  }
};

export const saveLocalStorageOrder = (orderIds: string[]) => {
  try {
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      console.error('Invalid order data provided for localStorage save');
      return 0;
    }
    
    console.log('Saving order to localStorage:', orderIds.length, 'items');
    
    const timestamp = Date.now();
    
    // Save immediately without checking if unchanged - we want to ensure the save happens
    localStorage.setItem(ORDER_KEY, JSON.stringify(orderIds));
    localStorage.setItem(TIMESTAMP_KEY, timestamp.toString());
    
    console.log('Order saved to localStorage with timestamp:', new Date(timestamp).toISOString());
    return timestamp;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return 0;
  }
};
