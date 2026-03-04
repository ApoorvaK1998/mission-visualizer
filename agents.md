# MissionVisualizer

A web application for visualizing mission data on an interactive map.

## Project Overview

This application visualizes geospatial data from a robotic mowing mission, including park infrastructure (poles, fences, obstacles, panels, stations), mission graph (nodes and edges), and docking locations.

## Functional Requirements Met

### Visualization
- Park boundaries/infrastructure (poles, fences, obstacles, panels, stations, compact stations)
- Mission graph (nodes and edges)
- Distinguishable areas and paths

### User Interactions
- Toggle visibility of different layers via layer control
- Inspect element information (ID, type, etc.) by clicking on elements

## Project Structure

```
/home/apoorva/Documents/assignment/
├── backend/                         # ASP.NET Core 8.0 API
│   └── MissionVisualizer.Api/
│       ├── Controllers/
│       │   └── DataController.cs   # Serves GeoJSON data
│       ├── Program.cs              # App configuration
│       └── wwwroot/data/           # GeoJSON data files
│           ├── mission.geojson      # Mission graph (nodes/edges)
│           └── data.geojson        # Park infrastructure
│
├── frontend/                        # React 18 application
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.js          # Main map with GeoJSON layers
│   │   │   └── Legend.js           # Map legend
│   │   ├── services/
│   │   │   └── dataService.js      # API fetch functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── Geo-processing/                  # Python scripts for geo data processing
│   ├── convert_data.py             # Converts gpkg/geojson to EPSG:4326
│   └── biddinghuizen.gpkg           # Source park data (EPSG:28992)
│
├── biddinghuizen_mission_utm.geojson # Source mission data (EPSG:32631)
└── venv/                            # Python virtual environment
```

## Tech Stack

- **Backend**: ASP.NET Core 8.0, C#
- **Frontend**: React 18, Leaflet, react-leaflet
- **Data Processing**: Python, GeoPandas, Fiona
- **Data Format**: GeoJSON (EPSG:4326/WGS84)

## Running the Application

### 1. Process Data (if needed)

```bash
cd Geo-processing
source ../venv/bin/activate
python convert_data.py
```

This converts:
- `biddinghuizen.gpkg` (EPSG:28992) → EPSG:4326
- `biddinghuizen_mission_utm.geojson` (EPSG:32631) → EPSG:4326

### 2. Start Backend

```bash
cd backend/MissionVisualizer.Api
dotnet run
```

Backend runs on: http://localhost:5000

### 3. Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on: http://localhost:3000

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/data/mission` | Returns mission graph (nodes/edges) |
| `GET /api/data/park/{layer}` | Returns park infrastructure layer |

## Map Layers

| Layer | Color | Description |
|-------|-------|-------------|
| Poles | Purple | Park poles (point locations) |
| Fences | Gray | Park boundary fences |
| Obstacles | Red | Obstacle areas |
| Panels | Brown | Panel areas |
| Stations | Orange | Station locations |
| Compact Stations | Magenta | Compact station locations |
| Mission Nodes | Blue | Mission waypoints |
| Mission Edges | Green | Paths between nodes |

## Design Choices & Assumptions

### Coordinate System Handling
- **EPSG:28992** (Amersfoort / RD New) → Converted to **EPSG:4326** (WGS84)
- **EPSG:32631** (WGS 84 / UTM zone 31N) → Converted to **EPSG:4326**
- All coordinates are transformed to WGS84 for display on Leaflet/OpenStreetMap

### Data Structure
- Mission graph: Points (nodes) and LineStrings (edges) in single file
- Park infrastructure: Multiple layer types in single GeoPackage, converted to single GeoJSON with `layer` property

### UI Design
- Layer control for toggling visibility (React Leaflet LayersControl)
- Popup info on click showing all feature properties
- Auto-fit bounds to show all visible data
- Legend for quick reference

### Assumptions
- Single park area (Biddinghuizen)
- All dock locations are part of stations layer
- Mowing tasks are represented as part of the mission graph (edges)
- No separate "mowing tasks" or "dock" data in provided files

## What I Would Improve With More Time

1. **Better Data Separation**: Separate mowing tasks and dock locations into distinct layers
2. **Performance**: Add clustering for large datasets, lazy loading
3. **Filtering**: Add ability to filter by specific attributes
4. **Search**: Add search functionality for nodes/elements
5. **Styling**: More sophisticated styling (icons, better colors, hover effects)
6. **Testing**: Add unit tests and integration tests
7. **Docker**: Add Docker configuration for easier deployment
8. **CI/CD**: Add continuous integration pipeline
9. **Mobile**: Responsive design for mobile devices

## Demo

The application is currently running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Open the frontend URL in a browser to see the interactive map with all layers.
