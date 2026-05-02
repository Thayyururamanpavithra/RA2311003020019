import { useState, useEffect } from 'react';
import { Log } from 'logging_middleware';

export const useAutoRefresh = (refreshFn: () => void, intervalSeconds: number = 30) => {
  const [timeLeft, setTimeLeft] = useState(intervalSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          Log("frontend", "debug", "api", "Auto-refresh triggered by useAutoRefresh");
          refreshFn();
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshFn, intervalSeconds]);

  return { timeLeft, resetTimer: () => setTimeLeft(intervalSeconds) };
};
