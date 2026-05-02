"use client";

import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { Notification } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import { useReadStatus } from '../hooks/useReadStatus';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
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
  clearReadHistory: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications, loading, error, refresh } = useNotifications();
  const { viewedIds, markAsRead, clearReadHistory } = useReadStatus();
  const { timeLeft, resetTimer } = useAutoRefresh(() => refresh(true));

  // Sync unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !viewedIds.has(n.id)).length;
  }, [notifications, viewedIds]);

  // Log on initial load
  useEffect(() => {
    Log("frontend", "info", "state", "NotificationProvider initialized");
  }, []);

  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    viewedIds,
    markAsRead,
    refresh,
    nextRefreshIn: timeLeft,
    clearReadHistory
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
