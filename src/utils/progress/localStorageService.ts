
const ORDER_KEY = 'progressItemsOrder';
const TIMESTAMP_KEY = 'progressItemsOrderTimestamp';

export const getLocalStorageOrder = () => {
  try {
    const savedOrderStr = localStorage.getItem(ORDER_KEY);
    const savedTimeStr = localStorage.getItem(TIMESTAMP_KEY);
    
    if (!savedOrderStr || !savedTimeStr) {
      return null;
    }
    
    const savedOrder = JSON.parse(savedOrderStr);
    const savedTimestamp = parseInt(savedTimeStr, 10);
    
    if (!Array.isArray(savedOrder) || savedOrder.length === 0) {
      console.error('Invalid saved order format in localStorage');
      return null;
    }
    
    return {
      orderIds: savedOrder,
      timestamp: savedTimestamp
    };
  } catch (e) {
    console.error('Error parsing saved order from localStorage:', e);
    return null;
  }
};

export const saveLocalStorageOrder = (orderIds: string[]) => {
  const timestamp = Date.now();
  localStorage.setItem(ORDER_KEY, JSON.stringify(orderIds));
  localStorage.setItem(TIMESTAMP_KEY, timestamp.toString());
  return timestamp;
};
