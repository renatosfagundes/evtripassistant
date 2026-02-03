# EV Trip Assistant

## Overview
EV Trip Assistant is a full-stack web application for planning electric vehicle (EV) trips with optimal charging stops, route visualization, and trip statistics. It leverages HERE Maps for route display and a custom backend for trip calculation, energy, and cost estimation.

---

## Features
- **EV Trip Planning**: Enter origin, destination, and vehicle data to get a full trip plan with charging stops.
- **HERE Maps Integration**: Interactive map with origin, destination, charging stop markers, and route polylines.
- **Automatic Map Fitting**: Map view automatically adjusts to show the entire route and all stops.
- **Trip Statistics**: Displays distance, duration, energy, and cost estimates.
- **Error Feedback**: User-friendly error messages and suggestions.
- **Modern UI**: Built with React, Vite, Tailwind CSS, and component libraries.

---

## Workflow
1. **User Input**: User fills out the trip form (origin, destination, vehicle specs).
2. **Backend Request**: Frontend sends a POST request to `/api/trip/plan` with trip data.
3. **Backend Processing**: Backend calculates the route, charging stops, and returns:
   - `origin`, `destination`, `chargingStops`
   - `distanceTotal`, `durationTotal`, `requiredStops`
   - `polylines`: Array of flexible polyline strings (one per route segment)
   - `polyline`: (optional) Full route polyline
4. **Frontend Mapping**: RouteMap component:
   - Plots all polylines and markers
   - Fits map bounds to show the entire trip
   - Displays trip info and error feedback

---

## Main Tools & Libraries
- **Frontend**:
  - React (Vite)
  - TypeScript
  - Tailwind CSS
  - HERE Maps JS API v3.1 (loaded via `index.html`)
  - Framer Motion (animations)
  - Lucide React (icons)
- **Backend**:
  - Node.js/Express (API)
  - HERE Routing API (trip/route calculation)
- **Testing**:
  - Vitest

---

## Project Structure
```
├── public/
│   └── robots.txt
├── src/
│   ├── App.tsx, main.tsx, App.css, index.css
│   ├── components/
│   │   ├── RouteMap.tsx         # Map rendering, markers, polylines, auto-fit
│   │   ├── RouteCard.tsx        # Trip summary card
│   │   ├── Dashboard.tsx        # Stats dashboard
│   │   ├── ChatBot.tsx          # Assistant/chat
│   │   ├── EVForm.tsx           # Trip input form
│   │   └── ui/                  # UI primitives (button, tabs, etc)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # API, calculations, utilities
│   ├── pages/
│   │   ├── Index.tsx            # Main landing page, trip workflow
│   │   └── EVTripPlanner.tsx    # (Optional) Standalone trip planner
│   └── test/                    # Vitest tests
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## Key Files & Navigation
- **src/pages/Index.tsx**: Main entry, handles trip form, backend calls, error feedback, and renders RouteMap.
- **src/components/RouteMap.tsx**: Core map logic. Accepts `routeData` prop with `origin`, `destination`, `chargingStops`, and `polylines`. Plots all segments and markers, auto-fits map.
- **src/components/EVForm.tsx**: User input for trip planning.
- **src/lib/api.ts**: API calls to backend.
- **src/lib/evCalculations.ts**: Utility functions for EV range, energy, and cost.
- **src/components/ui/**: Reusable UI components (button, tabs, toast, etc).

---

## How to Run
1. **Install dependencies**:
   ```sh
   npm install
   ```
2. **Set HERE Maps API Key**:
   - Add your key to `.env` as `VITE_HERE_API_KEY=your_key_here`
3. **Start the backend** (if separate):
   ```sh
   npm run backend
   # or follow backend/README.md
   ```
4. **Start the frontend**:
   ```sh
   npm run dev
   ```
5. **Open**: Visit `http://localhost:5173` (or as shown in terminal)

---

## Customization & Extending
- **Add new UI components**: Place in `src/components/` or `src/components/ui/`.
- **Change map logic**: Edit `RouteMap.tsx` for marker, polyline, or fit behavior.
- **Backend logic**: Update backend API to change route/stop calculation or response shape.
- **Testing**: Add tests in `src/test/` using Vitest.

---

## Troubleshooting
- **Map not showing**: Check HERE Maps API key, network, and browser console for errors.
- **Markers or polylines missing**: Ensure backend returns correct `origin`, `destination`, `chargingStops`, and `polylines`.
- **Route not fully visible**: RouteMap auto-fits bounds; check for invalid coordinates or missing segments.

---

## Credits
- HERE Maps JS API
- React, Vite, Tailwind CSS
- All contributors and open-source libraries used

---

## License
MIT License (see LICENSE file)
