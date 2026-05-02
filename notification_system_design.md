# Campus Notifications Microservice Design

## Stage 1: Priority Inbox Algorithm

### 1. Weight-based Scoring System
The notifications are fetched from the API and must be sorted efficiently so that students see the most critical updates first. We assign a static weight to each notification type:
- **Placement**: Weight = 3
- **Result**: Weight = 2
- **Event**: Weight = 1

The static weight represents the base priority level of the notification.

### 2. Recency Tiebreaker using Timestamp
Within the same category (e.g., multiple Placement notifications), newer notifications should appear before older ones. We utilize the timestamp to calculate a recency score.
The algorithm performs a stable sort:
1. Compare the Type Weight. Higher weight wins.
2. If weights are equal, compare the Timestamp. Higher timestamp (newer) wins.

### 3. Efficient Selection of Top N
- The algorithm parses all items and applies the sorting comparator (O(M log M)).
- Once sorted, it selects the first `N` elements based on user preference.

---

## Stage 2: Advanced Architecture & UX

### 1. Architecture Overview
The application is built using **Next.js (App Router)** for optimized performance and routing. The frontend architecture follows a modular approach:
- **State Management**: React Context API (`NotificationContext`) handles global notification state, unread tracking, and real-time polling.
- **Theme Engine**: Custom Material UI theme with `ThemeContext` supports seamless dark/light mode transitions and persistent user preferences.
- **Data Layer**: Robust API utility layer with Bearer token authentication and standardized error handling.

### 2. Component Hierarchy
- **Layout**: `AppLayout` manages the `SplashScreen` entry point and responsive navigation (Navbar for desktop, BottomNav for mobile).
- **Notifications**: Atomic components (`NotificationCard`, `NotificationModal`) handle data display with color-coded prioritization and interactive detail views.
- **Analytics**: Recharts-based visualizations for monitoring notification volume and distribution.

### 3. State Management Approach
We utilize a single source of truth for notifications via the `NotificationProvider`. This provider:
- Polls the API every 30 seconds.
- Tracks `viewedIds` in `localStorage` to identify new alerts.
- Provides atomic update functions (`markAsRead`, `refresh`) to sub-components.

### 4. Real-time Update Strategy
- **Polling**: Lightweight HTTP polling ensures the UI is up-to-date even without WebSockets.
- **Optimistic UI**: Read/unread status updates immediately in the local state while being persisted in background storage.
- **Visual Feedback**: Real-time "Live" indicators and animated notification counts alert the user to new data arrivals.

### 5. Priority Scoring Formula
In Stage 2, we enhance the scoring with a dynamic formula:
`Score = (BaseWeight × 100) + (RecencyScore × 0.5) + (KeywordUrgency × 0.2)`
- **BaseWeight**: Based on notification type (Placement=3, Result=2, Event=1).
- **RecencyScore**: Normalized time factor that decays as notifications age.
- **KeywordUrgency**: Boost for keywords like "Immediate", "Deadline", or "Urgent".

### 6. Dark Mode Implementation
The theme uses CSS variables and MUI's `alpha` utility for a premium "Glassmorphism" effect. Dark mode is optimized for high-contrast readability with a Slate-Navy palette.

### 7. Mobile-First Approach
- **Bottom Navigation**: Persistent access to core features on small screens.
- **Touch Targets**: All interactive elements are sized for a minimum 44px tap area.
- **Gesture Support**: Swiping interactions (planned) and responsive grid layouts.

### 8. Performance Optimizations
- **Skeleton Loading**: Prevents layout shift during data fetching.
- **Memoization**: `useMemo` and `useCallback` prevent unnecessary re-renders of heavy chart components.
- **Dynamic Imports**: Large visualization libraries are loaded only when needed.
