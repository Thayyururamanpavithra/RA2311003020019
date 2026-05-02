# Campus Notifications Frontend

This is the high-end frontend implementation for the Campus Notifications Microservice.

## 🌟 Advanced Frontend Features
- **Custom Design System**: Built on MUI v6 with a specialized color palette and glassmorphism components.
- **Skeleton Architecture**: Optimized loading sequences using MUI Skeletons for a fluid user experience.
- **Real-time Polling**: Background synchronization every 30 seconds with automatic local state reconciliation.
- **Persistent Preferences**: Local storage integration for theme settings and viewed notification history.

## 🏗️ Architecture
- **`/src/app`**: Next.js App Router with optimized page layouts.
- **`/src/components`**: Modular component library (Common, Dashboard, Notifications).
- **`/src/context`**: Global state management via Context API.
- **`/src/utils`**: Resilient API utilities with automated mock fallbacks.

## 🔧 Scripts
- `npm run dev`: Start the optimized development server.
- `npm run build`: Generate a high-performance production bundle.
- `npm run start`: Run the production-ready server.

## 🎨 Theme Implementation
The application utilizes a sophisticated theme provider that manages dynamic CSS variables and MUI overrides to deliver a premium look and feel in both light and dark modes.
