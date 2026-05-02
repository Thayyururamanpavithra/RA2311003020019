"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Notification } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import { useReadStatus } from '../hooks/useReadStatus';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { Log } from 'logging_middleware';
import { Toast } from '@/components/common/Toast';

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  viewedIds: Set<string>;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  refresh: (isAuto?: boolean) => Promise<void>;
  nextRefreshIn: number;
  clearReadHistory: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notifications, loading, error, refresh: pull } = useNotifications();
  const { viewedIds, markAsRead, markAsUnread, clearReadHistory } =
    useReadStatus();

  const [pollInterval, setPollInterval] = useState(30);
  const [newArrivalToast, setNewArrivalToast] = useState<{
    open: boolean;
    count: number;
  }>({ open: false, count: 0 });

  useEffect(() => {
    const readInterval = () => {
      const v = localStorage.getItem('refreshInterval');
      setPollInterval(v ? Math.max(10, Number(v)) : 30);
    };
    readInterval();
    const onSettings = () => readInterval();
    window.addEventListener('local-settings-updated', onSettings);
    return () => window.removeEventListener('local-settings-updated', onSettings);
  }, []);

  const { timeLeft, resetTimer } = useAutoRefresh(() => void pull(true), pollInterval);

  const refresh = useCallback(
    async (isAuto = false) => {
      if (!isAuto) {
        resetTimer();
      }
      try {
        await pull(isAuto);
      } catch {
        Log('frontend', 'warn', 'api', 'Auto-refresh failed, retrying on next interval');
      }
    },
    [pull, resetTimer]
  );

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !viewedIds.has(n.id)).length;
  }, [notifications, viewedIds]);

  const prevIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    Log('frontend', 'info', 'state', 'NotificationProvider initialized');
  }, []);

  useEffect(() => {
    if (loading) return;
    const ids = new Set(notifications.map((n) => n.id));
    if (prevIdsRef.current === null) {
      prevIdsRef.current = ids;
      return;
    }
    let newCount = 0;
    for (const n of notifications) {
      if (!prevIdsRef.current.has(n.id)) newCount++;
    }
    if (newCount > 0) {
      setNewArrivalToast({ open: true, count: newCount });
      Log(
        'frontend',
        'info',
        'component',
        `${newCount} new notification(s) arrived`
      );
    }
    prevIdsRef.current = ids;
  }, [notifications, loading]);

  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    viewedIds,
    markAsRead,
    markAsUnread,
    refresh,
    nextRefreshIn: timeLeft,
    clearReadHistory,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toast
        open={newArrivalToast.open}
        message={`${newArrivalToast.count} new notification(s)`}
        severity="info"
        onClose={() => setNewArrivalToast({ open: false, count: 0 })}
      />
    </NotificationContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationsContext must be used within a NotificationProvider'
    );
  }
  return context;
};
