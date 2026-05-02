import { Notification, NotificationType } from '@/types';

export const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/** Maps each notification id to a 0–999 score; newer items in the batch score higher. */
export function buildRecencyScoreMap(items: Notification[]): Map<string, number> {
  const map = new Map<string, number>();
  if (items.length === 0) return map;

  const times = items.map((n) => ({
    id: n.id,
    t: new Date(n.timestamp).getTime(),
  }));

  const values = times.map((x) => x.t);
  const minT = Math.min(...values);
  const maxT = Math.max(...values);

  for (const { id, t } of times) {
    const recency =
      maxT === minT ? 500 : Math.round(((t - minT) / (maxT - minT)) * 999);
    map.set(id, recency);
  }
  return map;
}

/** Final score = typeWeight × 1000 + recencyScore (spec). */
export function computePriorityScore(
  notification: Notification,
  recencyById: Map<string, number>
): number {
  const w = TYPE_WEIGHTS[notification.type] ?? 1;
  const r = recencyById.get(notification.id) ?? 0;
  return w * 1000 + r;
}

export function scoreAndAnnotate(notifications: Notification[]): Notification[] {
  const recency = buildRecencyScoreMap(notifications);
  return notifications.map((n) => ({
    ...n,
    priorityScore: computePriorityScore(n, recency),
  }));
}

export function priorityBreakdown(
  notification: Notification,
  allNotifications: Notification[]
): { typeWeight: number; typeContribution: number; recencyScore: number; total: number } {
  const recency = buildRecencyScoreMap(allNotifications);
  const typeWeight = TYPE_WEIGHTS[notification.type] ?? 1;
  const recencyScore = recency.get(notification.id) ?? 0;
  return {
    typeWeight,
    typeContribution: typeWeight * 1000,
    recencyScore,
    total: typeWeight * 1000 + recencyScore,
  };
}
