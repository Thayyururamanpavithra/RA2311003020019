"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { fetchNotifications, Notification } from '../utils/api';
import { Log } from 'logging_middleware';

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  viewedIds: Set<string>;
  markAsRead: (id: string) => void;
  refresh: () => Promise<void>;
  nextRefreshIn: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [nextRefreshIn, setNextRefreshIn] = useState(30);

  const loadViewed = useCallback(() => {
    try {
      const stored = localStorage.getItem('viewedNotifications');
      if (stored) {
        setViewedIds(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      Log("frontend", "error", "utils", "Failed to load viewed notifications from localStorage");
    }
  }, []);

  const refresh = useCallback(async (isAuto = false) => {
    if (isAuto) {
      Log("frontend", "debug", "api", "Auto-refresh triggered");
    }
    try {
      const data = await fetchNotifications();
      if (data) {
        setNotifications(data);
        setError(null);
        if (isAuto) {
          // Check for new notifications to show toast if needed (to be implemented)
        }
      }
    } catch (err) {
      setError("Failed to fetch notifications");
      Log("frontend", "warn", "api", "Auto-refresh failed, retrying in 30s");
    } finally {
      setLoading(false);
      setNextRefreshIn(30);
    }
  }, []);

  useEffect(() => {
    loadViewed();
    refresh();

    const interval = setInterval(() => {
      setNextRefreshIn((prev) => {
        if (prev <= 1) {
          refresh(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [refresh, loadViewed]);

  const markAsRead = useCallback((id: string) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(next)));
      Log("frontend", "info", "state", `Notification ID ${id} marked as read`);
      return next;
    });
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !viewedIds.has(n.id)).length;
  }, [notifications, viewedIds]);

  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    viewedIds,
    markAsRead,
    refresh,
    nextRefreshIn
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationProvider');
  }
  return context;
};
