import { Notification } from '@/types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "m1",
    type: "Placement",
    message: "Immediate Opportunity: Google is hiring Software Engineering Interns for Summer 2026. Application deadline in 48 hours!",
    timestamp: new Date().toISOString(),
    priorityScore: 98.5
  },
  {
    id: "m2",
    type: "Result",
    message: "Semester Results are out for the 2025 Winter session. Check the student portal for your updated GPA.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    priorityScore: 85.0
  },
  {
    id: "m3",
    type: "Event",
    message: "Annual Tech Symposium 'CodeAlpha' starts tomorrow at the Main Auditorium. Registration mandatory.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    priorityScore: 65.2
  },
  {
    id: "m4",
    type: "Placement",
    message: "Interview Shortlist: 45 students selected for Microsoft final rounds. Check the list at the Placement Cell.",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    priorityScore: 92.1
  },
  {
    id: "m5",
    type: "Event",
    message: "Guest Lecture by Dr. Sarah Chen on 'The Future of Agentic AI' scheduled for Friday.",
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    priorityScore: 45.0
  },
  {
    id: "m6",
    type: "Result",
    message: "Re-evaluation results for Engineering Mathematics-III have been published. 12 grade changes reported.",
    timestamp: new Date(Date.now() - 604800000).toISOString(),
    priorityScore: 78.5
  }
];
