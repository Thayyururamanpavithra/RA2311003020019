import { useMemo } from 'react';
import { Notification } from '../types';
import { Log } from 'logging_middleware';

const TYPE_WEIGHTS: Record<string, number> = {
  'Placement': 3,
  'Result': 2,
  'Event': 1,
};

export const usePrioritySort = (notifications: Notification[], n: number = 10) => {
  const sortedNotifications = useMemo(() => {
    Log("frontend", "debug", "hook", `usePrioritySort sorting ${notifications.length} items with N=${n}`);
    
    return [...notifications]
      .map(notification => {
        // Advanced Scoring Formula: (BaseWeight × 100) + (RecencyScore)
        const baseWeight = TYPE_WEIGHTS[notification.type] || 0;
        const timestamp = new Date(notification.timestamp).getTime();
        const now = Date.now();
        const ageInHours = (now - timestamp) / (1000 * 60 * 60);
        const recencyScore = Math.max(0, 100 - ageInHours); // Decays over time
        
        // Keyword urgency boost
        const keywords = ['immediate', 'deadline', 'urgent', 'mandatory'];
        const keywordBoost = keywords.some(k => notification.message.toLowerCase().includes(k)) ? 50 : 0;

        const score = (baseWeight * 100) + recencyScore + keywordBoost;
        return { ...notification, priorityScore: Math.round(score) };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, n);
  }, [notifications, n]);

  return sortedNotifications;
};
