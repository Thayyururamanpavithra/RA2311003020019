import { Log } from 'logging_middleware';
import { Notification, NotificationType } from '../types';

function parseNotificationType(raw: unknown): NotificationType {
  const s = String(raw ?? 'Event');
  if (s === 'Placement' || s === 'Result' || s === 'Event') return s;
  return 'Event';
}
import { MOCK_NOTIFICATIONS } from './mockData';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://20.207.122.201/evaluation-service';

const NOTIFICATIONS_URL = `${API_BASE}/notifications`;
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

function normalizeNotification(n: Record<string, unknown>): Notification {
  return {
    id: String(n.id ?? n.ID ?? Math.random().toString(36).slice(2, 11)),
    type: parseNotificationType(n.type ?? n.Type),
    message: String(n.message ?? n.Message ?? n.content ?? 'No message content'),
    timestamp: String(n.timestamp ?? n.Timestamp ?? new Date().toISOString()),
    priorityScore: Number(n.priorityScore ?? n.PriorityScore ?? n.priority ?? 0),
  };
}

export async function fetchNotifications(): Promise<Notification[]> {
  Log('frontend', 'debug', 'api', 'Fetching notifications from API');
  try {
    const response = await fetch(NOTIFICATIONS_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const rawNotifications = data.notifications ?? data;

    if (Array.isArray(rawNotifications)) {
      return rawNotifications.map((n: Record<string, unknown>) =>
        normalizeNotification(n)
      );
    }

    return [];
  } catch (error) {
    Log(
      'frontend',
      'warn',
      'api',
      `API fetch failed, using mock fallback: ${error instanceof Error ? error.message : String(error)}`
    );
    return MOCK_NOTIFICATIONS;
  }
}

export type NotificationQuery = {
  limit?: number;
  page?: number;
  notification_type?: 'Event' | 'Result' | 'Placement';
};

/** Optional server-side query; falls back to full list if unsupported. */
export async function fetchNotificationsWithQuery(
  query: NotificationQuery
): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (query.limit != null) params.set('limit', String(query.limit));
  if (query.page != null) params.set('page', String(query.page));
  if (query.notification_type) params.set('notification_type', query.notification_type);

  const qs = params.toString();
  const url = qs ? `${NOTIFICATIONS_URL}?${qs}` : NOTIFICATIONS_URL;

  Log('frontend', 'debug', 'api', `Fetching notifications with query: ${qs || '(none)'}`);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const rawNotifications = data.notifications ?? data;

    if (Array.isArray(rawNotifications)) {
      return rawNotifications.map((n: Record<string, unknown>) =>
        normalizeNotification(n)
      );
    }

    return [];
  } catch (error) {
    Log(
      'frontend',
      'warn',
      'api',
      `Query fetch failed, using unfiltered fetch: ${error instanceof Error ? error.message : String(error)}`
    );
    return fetchNotifications();
  }
}
