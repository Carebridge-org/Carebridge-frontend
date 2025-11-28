
# Continuous Calendar — Vite Conversion

This project was converted from the Next.js app in `/mnt/data/work/continuous-calendar/continuous-calendar` to a Vite + React app,
following the structure and style of Carebridge-frontend.

## What changed
- Based on Carebridge's Vite template (`Carebridge-frontend`)
- Next.js `app/` components were moved into `src/components/`
- Global CSS from Next was appended into `src/index.css`
- A new route `/calendar` renders the calendar via `src/pages/CalendarPage.jsx`
- React Router handles routing (no Next.js server or `app/` routing)

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview build

