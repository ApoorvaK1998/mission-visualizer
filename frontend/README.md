# Mission Visualizer - Frontend

A React TypeScript application for visualizing park mission data on an interactive map.

## Features

- **Interactive Map**: Built with Leaflet/React-Leaflet for seamless map exploration
- **Multiple Data Layers**: Toggle visibility for different map elements:
  - Poles
  - Fences
  - Obstacles
  - Panels
  - Stations
  - Compact Stations
  - Mission Nodes
  - Mission Edges
- **Hover Information**: Hover over any map feature to see detailed properties (ID, type, etc.)
- **Auto-fit Bounds**: Map automatically zooms to fit all visible data
- **Legend**: Visual reference for all layer types

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running at http://localhost:5000

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MapView.tsx    # Main map component with all layers
│   │   └── Legend.tsx     # Legend component
│   ├── services/
│   │   └── dataService.ts # API calls to backend
│   ├── types/
│   │   └── geojson.ts     # TypeScript interfaces
│   ├── App.tsx            # Main application component
│   ├── index.tsx          # Application entry point
│   └── reportWebVitals.ts # Performance metrics
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

The frontend expects these backend endpoints:

- `GET http://localhost:5000/api/data/mission` - Mission data (nodes and edges)
- `GET http://localhost:5000/api/data/park/data` - Park infrastructure data

## Usage

1. **Toggle Layers**: Use the layer control in the top-right corner to show/hide specific data layers
2. **View Details**: Hover over any feature on the map to see its properties (ID, type, etc.)
3. **Navigate**: Use mouse wheel to zoom, click and drag to pan
4. **Reset View**: Refresh the page to auto-fit all data

## Tech Stack

- React 18
- TypeScript
- Leaflet / React-Leaflet
- Create React App

## Troubleshooting

### Map not loading data
- Ensure the backend API is running at http://localhost:5000
- Check browser console for CORS errors

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript is properly configured in tsconfig.json
