import { useState, useEffect, useRef } from 'react';

export const useAutoRefresh = (
  refreshFn: () => void | Promise<void>,
  intervalSeconds: number = 30
) => {
  const [timeLeft, setTimeLeft] = useState(intervalSeconds);
  const intervalRef = useRef(intervalSeconds);

  useEffect(() => {
    intervalRef.current = intervalSeconds;
    setTimeLeft(intervalSeconds);
  }, [intervalSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          void refreshFn();
          return intervalRef.current;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshFn]);

  return {
    timeLeft,
    resetTimer: () => setTimeLeft(intervalRef.current),
  };
};
