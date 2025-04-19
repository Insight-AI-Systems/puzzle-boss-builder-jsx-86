
import { useState } from 'react';

export const useRateLimiting = (minTimeBetweenAttempts: number = 2000) => {
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastAttemptTime < minTimeBetweenAttempts) {
      return false;
    }
    setLastAttemptTime(now);
    return true;
  };

  return { checkRateLimit };
};
