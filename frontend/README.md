# Mission Visualizer

An interactive web application that visualizes a robot mission on a map, built as part of a technical assignment.

## Overview

This application displays park infrastructure and mission data on an interactive Leaflet map. It loads geospatial data from two sources:
- **biddinghuizen.gpkg** - Park boundaries, poles, fences, obstacles, panels, and dock locations
- **biddinghuizen_mission_utm.geojson** - Mission graph (nodes and edges), mowing tasks, and dock locations

## Features

- **Interactive Map**: Full-screen Leaflet map with pan/zoom
- **Layer Toggle**: Show/hide different data layers via control panel
- **Hover Information**: View element properties (ID, type) by hovering
- **Auto-fit**: Map automatically zooms to fit all data on load
- **Dark Theme**: Modern dark UI with custom styling

## Layers Visualized

| Layer | Description | Source |
|-------|-------------|--------|
| Poles | Park boundary poles | biddinghuizen.gpkg |
| Fences | Park boundaries | biddinghuizen.gpkg |
| Obstacles | Obstacle areas | biddinghuizen.gpkg |
| Panels | Solar panels | biddinghuizen.gpkg |
| Stations | Dock locations | biddinghuizen.gpkg |
| Compact Stations | Compact docking stations | biddinghuizen.gpkg |
| Nodes | Mission graph nodes | mission.geojson |
| Edges | Mission graph edges | mission.geojson |

## Running the Application

### Prerequisites

- Node.js (v18+)
- .NET 8 SDK
- Python 3 (for GeoProcessing)

### Backend Setup

```bash
cd backend/MissionVisualizer.Api
dotnet build
dotnet run --urls="http://localhost:5000"
```

The API will be available at http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000

### Environment Variables (Optional)

For the frontend, you can configure the API URL:

```bash
# .env file in frontend/
REACT_APP_API_URL=http://localhost:5000/api/data
```

## Project Structure

```
├── backend/
│   └── MissionVisualizer.Api/
│       ├── Controllers/DataController.cs  # API endpoints
│       └── wwwroot/data/                  # GeoJSON data files
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── MapView.tsx   # Main map component
│       │   └── Legend.tsx    # Legend overlay
│       ├── services/
│       │   └── dataService.ts # API calls
│       └── types/
│           └── geojson.ts     # TypeScript types
└── Geo-processing/
    ├── biddinghuizen.gpkg     # Original park data
    └── convert_data.py        # Data conversion script
```

## Future Improvements

With more time, I would add:

1. **Loading States**: Show spinners while data loads
2. **Error Boundaries**: Better error handling with user feedback
3. **Layer Reordering**: Allow dragging to change layer z-order
4. **Data Refresh**: Button to reload data without page refresh
5. **Mobile Responsive**: Better touch support for mobile devices
6. **Search/Filter**: Search for specific nodes or elements
7. **Measurements**: Distance/area measurement tools
8. **Export**: Export current view as image/PDF

