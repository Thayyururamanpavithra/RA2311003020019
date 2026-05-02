import { useState, useCallback, useEffect } from 'react';
import { Log } from 'logging_middleware';

export const useReadStatus = () => {
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem('viewedNotifications');
      if (stored) {
        setViewedIds(new Set(JSON.parse(stored)));
      }
    } catch {
      Log('frontend', 'error', 'hook', 'Failed to load viewed notifications from localStorage');
    }
  }, []);

  const persist = useCallback((next: Set<string>) => {
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(next)));
  }, []);

  const markAsRead = useCallback(
    (id: string) => {
      setViewedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        persist(next);
        Log('frontend', 'info', 'state', `Notification ID ${id} marked as read`);
        return next;
      });
    },
    [persist]
  );

  const markAsUnread = useCallback(
    (id: string) => {
      setViewedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        persist(next);
        Log('frontend', 'info', 'state', `Notification ID ${id} marked as unread`);
        return next;
      });
    },
    [persist]
  );

  const clearReadHistory = useCallback(() => {
    setViewedIds(new Set());
    localStorage.removeItem('viewedNotifications');
    Log('frontend', 'info', 'state', 'Read history cleared');
  }, []);

  return { viewedIds, markAsRead, markAsUnread, clearReadHistory };
};
