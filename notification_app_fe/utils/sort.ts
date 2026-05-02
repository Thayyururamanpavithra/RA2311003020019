import { Notification } from './api';

export const getPriorityWeight = (type: string): number => {
  switch (type) {
    case "Placement": return 3;
    case "Result": return 2;
    case "Event": return 1;
    default: return 0;
  }
};

export const sortNotifications = (notifications: Notification[]): Notification[] => {
  return [...notifications].sort((a, b) => {
    const weightA = getPriorityWeight(a.type);
    const weightB = getPriorityWeight(b.type);

    if (weightA !== weightB) {
      return weightB - weightA; // Higher weight first
    }

    // Tiebreaker: timestamp
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA; // Newer first
  });
};
