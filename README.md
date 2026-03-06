# Mission Visualizer

An interactive web application that visualizes a robot mowing mission on a park map.

## Overview

This application displays park infrastructure and mission data on an interactive Leaflet map. It loads geospatial data from two sources and allows users to toggle different layers visibility while inspecting element details.

## Features

- **Interactive Map**: Full-screen Leaflet map with pan/zoom controls
- **Layer Toggle**: Show/hide different data layers via control panel
- **Hover Information**: View element properties (ID, type) by hovering over features
- **Auto-fit**: Map automatically centers and zooms to fit all data on load
- **Dark Theme**: Modern dark UI with custom styling

## Layers Visualized

| Layer | Description | Source |
|-------|-------------|--------|
| Poles | Park boundary poles | biddinghuizen.gpkg |
| Fences | Park boundaries | biddinghuizen.gpkg |
| Obstacles | Obstacle areas | biddinghuizen.gpkg |
| Panels | Solar panels | biddinghuizen.gpkg |
| Stations | Docking stations | biddinghuizen.gpkg |
| Compact Stations | Compact docking stations | biddinghuizen.gpkg |
| Nodes | Mission graph waypoints | mission.geojson |
| Edges | Mission path connections | mission.geojson |

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: ASP.NET Core 8
- **Map**: Leaflet + React-Leaflet
- **Data Processing**: Python (GeoPandas)

## Project Structure

```
├── backend/
│   └── MissionVisualizer.Api/
│       ├── Controllers/
│       │   └── DataController.cs    # REST API endpoints
│       ├── Program.cs               # App configuration
│       └── wwwroot/data/           # GeoJSON data files
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── MapView.tsx         # Main map component
│       │   └── Legend.tsx          # Legend overlay
│       ├── services/
│       │   └── dataService.ts       # API calls
│       ├── types/
│       │   └── geojson.ts          # TypeScript interfaces
│       ├── App.tsx                 # Main app component
│       ├── index.tsx                # Entry point
│       └── index.css                # Global styles
│
├── Geo-processing/
│   ├── biddinghuizen.gpkg          # Original park data (EPSG:28992)
│   └── convert_data.py             # Data conversion script
│
├── venv/                           # Python virtual environment
└── README.md
```

## Prerequisites

- Node.js (v18+)
- .NET 8 SDK
- Python 3.8+

## Running the Application

### Option 1: Quick Start Script

```bash
# From project root
./start.sh
```

This will start both backend and frontend automatically.

### Option 2: Manual Setup

#### Backend

```bash
cd backend/MissionVisualizer.Api

# Build and run
dotnet build
dotnet run --urls="http://localhost:5000"

# Or run from bin
cd bin/Debug/net8.0
dotnet MissionVisualizer.Api.dll --urls="http://localhost:5000"
```

The API will be available at **http://localhost:5000**

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at **http://localhost:3000**

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/data/mission` | Mission graph data (nodes + edges) |
| `GET /api/data/park/data` | Park infrastructure data |

## Data Handling

### Coordinate Systems

- **Park data** (biddinghuizen.gpkg): EPSG:28992 (Amersfoort / RD New)
- **Mission data** (mission.geojson): EPSG:32631 (UTM zone 31N)
- **Display**: EPSG:4326 (WGS84)

The backend serves the data as-is, and the conversion happens during the initial data processing step (see Geo-processing/convert_data.py).

### Data Sources

1. **biddinghuizen.gpkg** - GeoPackage containing park infrastructure:
   - Poles, fences, obstacles, panels
   - Stations and compact stations (dock locations)

2. **biddinghuizen_mission_utm.geojson** - Mission data:
   - Nodes (27 waypoints)
   - Edges (55 path connections)

## Key Design Choices

### 1. Separation of Concerns
- Backend serves static GeoJSON files via REST API
- Frontend handles all visualization logic
- Python scripts for data conversion (one-time setup)

### 2. Client-Side Rendering
- All map rendering happens in the browser
- No server-side map tile generation needed
- Uses OpenStreetMap tiles

### 3. TypeScript for Type Safety
- Strong typing for GeoJSON structures
- Reduced runtime errors
- Better IDE support

### 4. Dark Theme UI
- Modern aesthetic with cyan/teal accents
- Custom styled Leaflet controls
- Glass-morphism effects on overlays

## Future Improvements

With more time, these features would enhance the application:

1. **Loading States**: Spinners/skeletons while data loads
2. **Error Boundaries**: User-friendly error messages
3. **Layer Reordering**: Drag to change z-order
4. **Data Refresh**: Reload without page refresh
5. **Mobile Support**: Touch-friendly controls
6. **Search**: Find specific nodes/elements
7. **Measurements**: Distance/area calculation tools
8. **Export**: Save map as image/PDF
