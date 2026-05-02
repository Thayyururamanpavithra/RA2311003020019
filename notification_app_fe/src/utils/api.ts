import { Log } from 'logging_middleware';
import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from './mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://20.244.56.144/evaluation-service/notifications";
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export const fetchNotifications = async (): Promise<Notification[]> => {
  Log("frontend", "debug", "api", "Fetching notifications from API");
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    // The API might return notifications in a 'notifications' field or as a direct array
    const rawNotifications = data.notifications || data;
    
    if (Array.isArray(rawNotifications)) {
      return rawNotifications.map((n: any) => ({
        id: n.id || n.ID || Math.random().toString(36).substr(2, 9),
        type: (n.type || n.Type || 'Event') as any,
        message: n.message || n.Message || n.content || 'No message content',
        timestamp: n.timestamp || n.Timestamp || new Date().toISOString(),
        priorityScore: n.priorityScore || n.PriorityScore || n.priority || 0
      }));
    }
    
    return [];
  } catch (error) {
    console.warn("API Fetch failed, using mock fallback:", error);
    return MOCK_NOTIFICATIONS;
  }
};
