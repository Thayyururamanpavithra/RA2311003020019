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

### Architecture Overview
The application is built using **Next.js (App Router)** with a micro-frontend architecture mindset. It utilizes **Material UI (MUI)** for an enterprise-grade design system and **Framer Motion** for immersive animations.

### Component Hierarchy
- **Layout Core**: `AppLayout` -> `Navbar` / `FloatingBottomNav` / `SplashScreen`.
- **Context Layer**: `ThemeContext` (MUI Theme Engine) & `NotificationContext` (Global State).
- **Hook Layer**: Modularized logic via `useNotifications`, `usePrioritySort`, `useAutoRefresh`, and `useReadStatus`.
- **Atomic UI**: High-performance components like `StatCard`, `NotificationCard`, and `AnimatedCounter`.

### State Management Approach
We use a hybrid approach:
- **React Context**: For global notification streams and user theme preferences.
- **Local Storage**: For persistent user settings (items per page, refresh interval) and read/unread history tracking.
- **Custom Hooks**: To decouple business logic (sorting, polling) from UI components.

### Real-time Update Strategy
- **Background Polling**: An intelligent `useAutoRefresh` hook polls the microservice every 30-60 seconds (configurable).
- **Live Feedback**: A real-time countdown timer in the Navbar and Dashboard alerts users to upcoming data refreshes.
- **Optimistic Updates**: Immediate UI feedback for marking notifications as read.

### Priority Scoring Formula
`Score = (BaseWeight × 100) + (RecencyScore × 1.0) + (KeywordUrgency × 50)`
- **BaseWeight**: Static weight based on Type (Placement=3, Result=2, Event=1).
- **RecencyScore**: A decaying linear factor (100 - age_in_hours).
- **KeywordUrgency**: 50pt boost for messages containing critical keywords (e.g., "Deadline", "Urgent").

### Performance Optimizations
- **Memoized Calculations**: All sorting and filtering are wrapped in `useMemo` to prevent UI jank during re-renders.
- **Lazy Loading**: Heavy charts and visualizations use dynamic imports or conditional rendering.
- **Backdrop Blurs**: Efficient use of `backdrop-filter` for glassmorphism without compromising performance.

### Dark Mode Implementation
- **Deep Slate Palette**: Optimized for OLED screens and low-light environments.
- **Electric Blue Accents**: High-contrast primary color for clear call-to-actions.
- **LocalStorage Sync**: Theme preference persists across sessions and tabs.

### Mobile-First Approach
- **Floating Navigation**: A modern, thumb-friendly floating bottom bar for quick access.
- **Gesture Control**: Intuitive swipe-to-read and swipe-to-dismiss interactions.
- **Adaptive Layouts**: Fluid container scaling using MUI's `breakpoints`.
