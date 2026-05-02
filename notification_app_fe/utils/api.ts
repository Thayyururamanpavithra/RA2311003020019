import { Log } from 'logging_middleware';

export interface Notification {
  id: string;
  type: "Event" | "Result" | "Placement";
  content: string;
  timestamp: string | number;
  priority?: number;
}

const API_URL = "/api/evaluation-service/notifications";

export const fetchNotifications = async (): Promise<Notification[]> => {
  Log("frontend", "debug", "api", "Fetching notifications from API");
  try {
    const token = process.env.NEXT_PUBLIC_API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwdDEzNzlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjA4OSwiaWF0IjoxNzc3NzAxMTg5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTlmZmQzNTUtNGY1Yy00MWY1LWI2N2YtMzMyOTQ2ZWNmZmNiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidCByIHBhdml0aHJhIiwic3ViIjoiMzc2ZTAwOGEtNWM3Yi00NWZhLWI2ODctYmQxZTMwNDFkZmE2In0sImVtYWlsIjoicHQxMzc5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoidCByIHBhdml0aHJhIiwicm9sbE5vIjoicmEyMzExMDAzMDIwMDE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzc2ZTAwOGEtNWM3Yi00NWZhLWI2ODctYmQxZTMwNDFkZmE2IiwiY2xpZW50U2VjcmV0IjoiTUJKcFZiR1J2dWtUY1BDUyJ9.mAVJWN61oJRSuBJMYfDm8aN-YYbmhQmNIfm1S0ptjzE";
    const response = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    if (data.notifications && Array.isArray(data.notifications)) {
      return data.notifications.map((n: any) => ({
        id: n.ID,
        type: n.Type,
        content: n.Message,
        timestamp: n.Timestamp
      }));
    }
    return [];
  } catch (error) {
    Log("frontend", "error", "api", "Failed to fetch notifications");
    return [];
  }
};
