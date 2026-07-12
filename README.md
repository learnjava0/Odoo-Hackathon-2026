# TransitOps Frontend

TransitOps is a React + Vite frontend for fleet operations, built for the Odoo Hackathon 2026 challenge. It provides a dashboard-style experience for fleet oversight, driver management, trip tracking, maintenance planning, fuel expense review, and analytics.

## Features

- Authentication flow with protected routes
- Fleet dashboard and analytics views
- Driver, trip, maintenance, and fuel expense pages
- Role-based navigation and page access control
- Mock API layer for local development
- CSV export helpers and reusable UI components

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS
- React Router DOM
- Axios
- react-hook-form + zod
- Recharts
- date-fns
- lucide-react
- sonner

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

Or use:

```bash
npm start
```

The app will usually open at:

- http://localhost:5173

If port 5173 is busy, Vite will automatically choose the next available port.

## Available Scripts

```bash
npm run dev     # start Vite dev server
npm start       # same as npm run dev
npm run build   # create production build
npm run preview # preview production build locally
```

## Environment and Mock Mode

The frontend supports mock data for local development.

Set the following environment variable if needed:

```bash
VITE_USE_MOCKS=true
```

## Project Structure

```text
src/
  api/                # API clients and mock services
  components/         # Reusable UI and layout components
  constants/          # Roles, navigation, and shared constants
  context/            # Auth and app data providers
  hooks/              # Custom hooks such as access control
  pages/              # Route-level pages
  routes/             # Router configuration and protected routes
  utils/              # Helper functions for calculations, dates, CSV export
  main.jsx            # App entry point
  App.jsx             # Root app component
```

## Main Pages

- Dashboard
- Fleet
- Drivers
- Trips
- Maintenance
- Fuel Expenses
- Analytics
- Settings
- Login / Forbidden access screens

## Notes

- The project is designed to work locally without a backend by using mock data.
- If you encounter startup issues, make sure dependencies are installed and that the project root is the correct folder.
