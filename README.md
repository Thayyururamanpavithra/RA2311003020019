# Campus Notifications Microservice

A responsive and feature-rich campus notification management platform built with Next.js and TypeScript. Students receive real-time updates on Placements, Events, and Results with an intelligent priority inbox system.

## Features

- Real-time notification updates with auto-refresh
- Priority inbox with smart ranking algorithm
- Dark and light mode toggle
- Advanced search and filter system
- Dashboard with analytics and statistics
- Responsive design for desktop and mobile
- Custom logging middleware integration
- Skeleton loaders and smooth animations
- Notification read/unread tracking
- Material UI component library

## Tech Stack

- Framework: Next.js with TypeScript
- Styling: Material UI
- State Management: React Context API
- Custom Hooks for data fetching
- REST API integration

## Project Structure

RA2311003020019/
├── logging_middleware/
│   ├── index.ts
│   └── package.json
├── notification_app_fe/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   ├── notifications/
│       │   ├── dashboard/
│       │   └── priority/
│       ├── hooks/
│       ├── pages/
│       ├── styles/
│       ├── utils/
│       ├── api/
│       ├── types/
│       └── context/
├── notification_system_design.md
└── .gitignore

## Pages

- Dashboard: Summary stats and recent activity
- All Notifications: Full list with filters
- Priority Inbox: Top N ranked notifications
- Statistics: Charts and analytics
- Settings: User preferences

## Priority Algorithm

Notifications are ranked using a weight based scoring system:

- Placement = 3 (highest priority)
- Result = 2 (medium priority)
- Event = 1 (lowest priority)

Final Score = Type Weight x 1000 + Recency Score

Recency is calculated from the notification timestamp so newer notifications rank higher within the same type category.

## Getting Started

### Prerequisites
- Node.js 18 or above
- npm or yarn

### Installation

git clone https://github.com/Thayyururamanpavithra/RA2311003020019.git
cd RA2311003020019/notification_app_fe
npm install
npm run dev

Open your browser at http://localhost:3000

## Logging Middleware

A custom reusable logging package is integrated throughout the entire application.

Function signature: Log(stack, level, package, message)

Example usage:
Log("frontend", "info", "page", "Dashboard loaded successfully")
Log("frontend", "error", "api", "Failed to fetch notifications")
Log("frontend", "debug", "hook", "Priority sort completed")

No console.log is used anywhere in the project.

## API Endpoints Used

- GET /evaluation-service/notifications
- POST /evaluation-service/logs
- POST /evaluation-service/register
- POST /evaluation-service/auth

## Query Parameters

- limit: Number of notifications per page
- page: Page number
- notification_type: Event / Result / Placement

## Notification Types

- Placement: Campus recruitment drives
- Result: Academic results and reviews
- Event: College events and activities

## Key Implementation Details

- Auto refresh every 30 seconds
- Read/unread status stored in localStorage
- Theme preference stored in localStorage
- Filter preferences stored in localStorage
- Error boundaries on every page
- Skeleton loaders on all data fetches
- Toast notifications for user feedback
- Mobile bottom navigation bar
- Responsive on all screen sizes

## Folder Naming Convention

- components: Reusable UI components
- hooks: Custom React hooks
- pages: Next.js page routes
- styles: Global styles and theme
- utils: Helper functions
- api: API call functions
- types: TypeScript interfaces
- context: React context providers

## Commit History

- init project structure
- add logging middleware
- implement priority sort algorithm
- add notification system design doc
- add dashboard with stats cards
- add all notifications page
- add priority inbox with ranking
- add real time auto refresh
- add stats page with charts
- add settings page
- add mobile bottom navigation
- add search and advanced filters
- add notification detail modal
- improve performance and code quality
- update system design documentation
- final polish and bug fixes# Campus Notifications Microservice

A responsive and feature-rich campus notification management platform built with Next.js and TypeScript. Students receive real-time updates on Placements, Events, and Results with an intelligent priority inbox system.

## Features

- Real-time notification updates with auto-refresh
- Priority inbox with smart ranking algorithm
- Dark and light mode toggle
- Advanced search and filter system
- Dashboard with analytics and statistics
- Responsive design for desktop and mobile
- Custom logging middleware integration
- Skeleton loaders and smooth animations
- Notification read/unread tracking
- Material UI component library

## Tech Stack

- Framework: Next.js with TypeScript
- Styling: Material UI
- State Management: React Context API
- Custom Hooks for data fetching
- REST API integration

## Project Structure

RA2311003020019/
├── logging_middleware/
│   ├── index.ts
│   └── package.json
├── notification_app_fe/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   ├── notifications/
│       │   ├── dashboard/
│       │   └── priority/
│       ├── hooks/
│       ├── pages/
│       ├── styles/
│       ├── utils/
│       ├── api/
│       ├── types/
│       └── context/
├── notification_system_design.md
└── .gitignore

## Pages

- Dashboard: Summary stats and recent activity
- All Notifications: Full list with filters
- Priority Inbox: Top N ranked notifications
- Statistics: Charts and analytics
- Settings: User preferences

## Priority Algorithm

Notifications are ranked using a weight based scoring system:

- Placement = 3 (highest priority)
- Result = 2 (medium priority)
- Event = 1 (lowest priority)

Final Score = Type Weight x 1000 + Recency Score

Recency is calculated from the notification timestamp so newer notifications rank higher within the same type category.

## Getting Started

### Prerequisites
- Node.js 18 or above
- npm or yarn

### Installation

git clone https://github.com/Thayyururamanpavithra/RA2311003020019.git
cd RA2311003020019/notification_app_fe
npm install
npm run dev

Open your browser at http://localhost:3000

## Logging Middleware

A custom reusable logging package is integrated throughout the entire application.

Function signature: Log(stack, level, package, message)

Example usage:
Log("frontend", "info", "page", "Dashboard loaded successfully")
Log("frontend", "error", "api", "Failed to fetch notifications")
Log("frontend", "debug", "hook", "Priority sort completed")

No console.log is used anywhere in the project.

## API Endpoints Used

- GET /evaluation-service/notifications
- POST /evaluation-service/logs
- POST /evaluation-service/register
- POST /evaluation-service/auth

## Query Parameters

- limit: Number of notifications per page
- page: Page number
- notification_type: Event / Result / Placement

## Notification Types

- Placement: Campus recruitment drives
- Result: Academic results and reviews
- Event: College events and activities

## Key Implementation Details

- Auto refresh every 30 seconds
- Read/unread status stored in localStorage
- Theme preference stored in localStorage
- Filter preferences stored in localStorage
- Error boundaries on every page
- Skeleton loaders on all data fetches
- Toast notifications for user feedback
- Mobile bottom navigation bar
- Responsive on all screen sizes

## Folder Naming Convention

- components: Reusable UI components
- hooks: Custom React hooks
- pages: Next.js page routes
- styles: Global styles and theme
- utils: Helper functions
- api: API call functions
- types: TypeScript interfaces
- context: React context providers

## Commit History

- init project structure
- add logging middleware
- implement priority sort algorithm
- add notification system design doc
- add dashboard with stats cards
- add all notifications page
- add priority inbox with ranking
- add real time auto refresh
- add stats page with charts
- add settings page
- add mobile bottom navigation
- add search and advanced filters
- add notification detail modal
- improve performance and code quality
- update system design documentation
- final polish and bug fixes
