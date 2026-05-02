# Campus Notifications Microservice

A responsive, feature-rich campus notification management platform built with Next.js and TypeScript. Students receive real-time updates on Placements, Events, and Results with an intelligent priority inbox system, analytics, and settings.

## Features

- Real-time updates with auto-refresh and countdown
- Dashboard with stat cards, charts, and recent activity
- All notifications with search, filters, sorting, and pagination
- Priority inbox with Top-N slider and ranking badges
- Detail modal with score breakdown and copy/share actions
- Read/unread tracking persisted in localStorage
- Dark/light mode toggle persisted in localStorage
- Mobile-first navigation
- Custom logging middleware (`Log()`) used across the app (no `console.log`)

## Tech Stack

- Framework: Next.js (App Router) + TypeScript
- UI: Material UI (MUI) only
- Animations: Framer Motion
- Charts: Recharts
- Logging: custom reusable middleware (`logging_middleware`)

## Priority Algorithm (spec)

Placement = 3, Result = 2, Event = 1  
Final Score = TypeWeight × 1000 + RecencyScore (0–999 within the fetched batch)

## Project Structure

RA2311003020019/
├── logging_middleware/
├── notification_app_fe/
├── notification_system_design.md
└── .gitignore

## Getting Started

Prerequisites: Node.js 18+

```bash
cd notification_app_fe
npm install
npm run dev
```

Open `http://localhost:3000` (or the next available port if 3000 is in use).
