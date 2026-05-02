import { Log } from 'logging_middleware';
import { Notification } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://20.244.56.144/evaluation-service/notifications";
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwdDEzNzlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjA4OSwiaWF0IjoxNzc3NzAxMTg5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTlmZmQzNTUtNGY1Yy00MWY1LWI2N2YtMzMyOTQ2ZWNmZmNiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidCByIHBhdml0aHJhIiwic3ViIjoiMzc2ZTAwOGEtNWM3Yi00NWZhLWI2ODctYmQxZTMwNDFkZmE2In0sImVtYWlsIjoicHQxMzc5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidCByIHBhdml0aHJhIiwicm9sbE5vIjoicmEyMzExMDAzMDIwMDE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzc2ZTAwOGEtNWM3Yi00NWZhLWI2ODctYmQxZTMwNDFkZmE2IiwiY2xpZW50U2VjcmV0IjoiTUJKcFZiR1J2dWtUY1BDUyJ9.mAVJWN61oJRSuBJMYfDm8aN-YYbmhQmNIfm1S0ptjzE";

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
    Log("frontend", "error", "api", `Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
};
