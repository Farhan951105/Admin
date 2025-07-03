
import { useState, useEffect } from 'react';

/**
 * A custom hook that provides the current time, updated every second.
 * This is useful for components and other hooks that need to react to the passage of time.
 */
export const useNow = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
};
