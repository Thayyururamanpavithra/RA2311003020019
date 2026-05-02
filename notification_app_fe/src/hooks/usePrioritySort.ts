import { useMemo } from 'react';
import { Notification } from '../types';
import { Log } from 'logging_middleware';
import { scoreAndAnnotate } from '../utils/priorityScore';

export const usePrioritySort = (notifications: Notification[], n: number = 10) => {
  const sortedNotifications = useMemo(() => {
    Log(
      'frontend',
      'debug',
      'hook',
      `usePrioritySort sorting ${notifications.length} items with N=${n}`
    );

    return scoreAndAnnotate([...notifications])
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, n);
  }, [notifications, n]);

  return sortedNotifications;
};
