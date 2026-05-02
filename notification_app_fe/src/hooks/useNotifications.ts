import { useState, useCallback, useEffect } from 'react';
import { fetchNotifications } from '../utils/api';
import { Notification } from '../types';
import { Log } from 'logging_middleware';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (isAuto = false) => {
    if (isAuto) {
      Log("frontend", "debug", "api", "Auto-refresh triggered");
    } else {
      Log("frontend", "debug", "api", "Manual refresh triggered");
    }

    try {
      const data = await fetchNotifications();
      if (data) {
        setNotifications(data);
        setError(null);
        Log("frontend", "debug", "hook", `useNotifications fetched ${data.length} items`);
      }
    } catch (err) {
      setError("Failed to fetch notifications");
      Log("frontend", "warn", "api", "Notification fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { notifications, loading, error, refresh };
};
