export type NotificationType = 'Placement' | 'Result' | 'Event';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  priorityScore: number;
}

export interface UserSettings {
  mode: 'light' | 'dark';
  refreshInterval: number;
  itemsPerPage: number;
  enabledTypes: NotificationType[];
}

export interface DashboardStats {
  total: number;
  placement: number;
  result: number;
  event: number;
  unread: number;
}
