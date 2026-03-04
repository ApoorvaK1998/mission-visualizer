import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ScaleControl,
  ZoomControl,
  useMap
} from "react-leaflet";
import { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import { fetchMission, fetchData } from "../services/dataService";
import { GeoJsonData } from "../types/geojson";

const { Overlay } = LayersControl;

type GeoCoords = number[] | number[][] | number[][][] | number[][][][];

interface GeoFeature {
  geometry: {
    type: string;
    coordinates: GeoCoords;
  };
}

function getBoundsFromFeatures(features: GeoFeature[]): L.LatLngBounds | null {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  
  features.forEach(f => {
    if (!f.geometry) return;
    
    const coords = f.geometry.coordinates;
    
    const processCoords = (lng: number, lat: number) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    };

    if (f.geometry.type === "Point") {
      const [lng, lat] = coords as number[];
      processCoords(lng, lat);
    } else if (f.geometry.type === "LineString" || f.geometry.type === "MultiPoint") {
      (coords as number[][]).forEach(([lng, lat]) => processCoords(lng, lat));
    } else if (f.geometry.type === "Polygon" || f.geometry.type === "MultiLineString") {
      (coords as number[][][]).forEach(ring => ring.forEach(([lng, lat]) => processCoords(lng, lat)));
    } else if (f.geometry.type === "MultiPolygon") {
      (coords as number[][][][]).forEach(polygon => 
        polygon.forEach(ring => ring.forEach(([lng, lat]) => processCoords(lng, lat)))
      );
    }
  });
  
  if (minLat === Infinity) return null;
  return L.latLngBounds([[minLat, minLng], [maxLat, maxLng]]);
}

interface FitBoundsToDataProps {
  data: GeoJsonData | null;
  mission: GeoJsonData | null;
}

function FitBoundsToData({ data, mission }: FitBoundsToDataProps): null {
  const map = useMap();

  useEffect(() => {
    if (!data && !mission) return;

    const allFeatures: GeoFeature[] = [];
    
    if (data?.features) {
      allFeatures.push(...data.features);
    }
    
    if (mission?.features) {
      allFeatures.push(...mission.features);
    }

    if (allFeatures.length === 0) return;

    const bounds = getBoundsFromFeatures(allFeatures);
    
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
      setTimeout(() => {
        const currentZoom = map.getZoom();
        if (currentZoom > 17) {
          map.setZoom(17);
        }
      }, 100);
    }
  }, [data, mission, map]);

  return null;
}

const POLE_STYLE: L.CircleMarkerOptions = { color: "#8b5cf6", fillColor: "#8b5cf6", fillOpacity: 0.85, weight: 1, radius: 5 };
const FENCE_STYLE: L.PathOptions = { color: "#64748b", weight: 2.5, dashArray: "10, 8", fillOpacity: 0 };
const OBSTACLE_STYLE: L.PathOptions = { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.4, weight: 1.5 };
const PANEL_STYLE: L.PathOptions = { color: "#eab308", fillColor: "#eab308", fillOpacity: 0.45, weight: 1.5 };
const STATION_STYLE: L.CircleMarkerOptions = { color: "#ec4899", fillColor: "#ec4899", fillOpacity: 0.85, weight: 1, radius: 8 };
const COMPACT_STATION_STYLE: L.CircleMarkerOptions = { color: "#f97316", fillColor: "#f97316", fillOpacity: 0.85, weight: 1, radius: 6 };
const NODE_STYLE: L.CircleMarkerOptions = { color: "#00d4aa", fillColor: "#00d4aa", fillOpacity: 0.9, weight: 1, radius: 5 };
const EDGE_STYLE: L.PathOptions = { color: "#22c55e", weight: 2.5 };

export default function MapView(): JSX.Element {
  const [mission, setMission] = useState<GeoJsonData | null>(null);
  const [data, setData] = useState<GeoJsonData | null>(null);

  useEffect(() => {
    fetchMission().then(setMission).catch(console.error);
    fetchData().then(setData).catch(console.error);
  }, []);

  const onEachFeature = useCallback((feature: { properties: Record<string, unknown> }, layer: L.Layer): void => {
    const props = feature.properties || {};
    const propsHtml = Object.entries(props)
      .map(([k, v]) => `<strong>${k}:</strong> ${v ?? "N/A"}`)
      .join("<br/>");
    
    layer.bindPopup(propsHtml, { closeButton: false, className: "custom-popup" });
    
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        const popup = targetLayer.getPopup();
        if (popup) {
          const layerWithMap = layer as L.Layer & { _map: L.Map };
          if (layerWithMap._map) {
            popup.setLatLng(e.latlng).openOn(layerWithMap._map);
          }
        }
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        (e.target as L.Path).closePopup();
      }
    });
  }, []);

  const filterByGeomType = useCallback((geoJson: GeoJsonData | null, geomType: string): GeoJsonData | null => {
    if (!geoJson) return null;
    const filtered = geoJson.features.filter(f => f.geometry?.type === geomType);
    if (filtered.length === 0) return null;
    return { ...geoJson, features: filtered };
  }, []);

  const filterByLayer = useCallback((geoJson: GeoJsonData | null, layerName: string): GeoJsonData | null => {
    if (!geoJson) return null;
    const filtered = geoJson.features.filter(f => f.properties?.layer === layerName);
    if (filtered.length === 0) return null;
    return { ...geoJson, features: filtered };
  }, []);

  return (
    <MapContainer
      center={[52.4245, 5.6913]}
      zoom={17}
      style={{ height: "calc(100vh - 60px)", flex: 1 }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LayersControl position="topright">
        <Overlay checked name="Poles">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "poles")!}
              style={POLE_STYLE}
              pointToLayer={(_f, latlng) => L.circleMarker(latlng, POLE_STYLE)}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Fences">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "fences")!}
              style={FENCE_STYLE}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Obstacles">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "obstacles")!}
              style={OBSTACLE_STYLE}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Panels">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "panels")!}
              style={PANEL_STYLE}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Stations">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "stations")!}
              style={STATION_STYLE}
              pointToLayer={(_f, latlng) => L.circleMarker(latlng, STATION_STYLE)}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Compact Stations">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "compactstations")!}
              style={COMPACT_STATION_STYLE}
              pointToLayer={(_f, latlng) => L.circleMarker(latlng, COMPACT_STATION_STYLE)}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Nodes">
          {mission && (
            <GeoJSON
              data={filterByGeomType(mission, "Point")!}
              style={NODE_STYLE}
              pointToLayer={(_f, latlng) => L.circleMarker(latlng, NODE_STYLE)}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Edges">
          {mission && (
            <GeoJSON
              data={filterByGeomType(mission, "LineString")!}
              style={EDGE_STYLE}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>
      </LayersControl>

      <div style={{ position: "absolute", bottom: "24px", right: "24px", zIndex: 999 }}>
        <ZoomControl position="topright" />
      </div>

      <ScaleControl position="bottomleft" />

      <FitBoundsToData data={data} mission={mission} />
    </MapContainer>
  );
}
