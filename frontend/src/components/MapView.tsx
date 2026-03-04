import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  ScaleControl,
  ZoomControl,
  useMap
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { fetchMission, fetchData } from "../services/dataService";
import { GeoJsonData } from "../types/geojson";

const { Overlay } = LayersControl;

function getBoundsFromFeatures(features: { geometry: { type: string; coordinates: number[] | number[][] | number[][][] | number[][][][] } }[]): L.LatLngBounds | null {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  
  features.forEach(f => {
    if (!f.geometry) return;
    
    const coords = f.geometry.coordinates;
    
    if (f.geometry.type === "Point") {
      const [lng, lat] = coords as number[];
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    } else if (f.geometry.type === "LineString" || f.geometry.type === "MultiPoint") {
      (coords as number[][]).forEach(([lng, lat]) => {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
    } else if (f.geometry.type === "Polygon" || f.geometry.type === "MultiLineString") {
      (coords as number[][][]).forEach(ring => {
        ring.forEach(([lng, lat]) => {
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        });
      });
    } else if (f.geometry.type === "MultiPolygon") {
      (coords as number[][][][]).forEach(polygon => {
        polygon.forEach(ring => {
          ring.forEach(([lng, lat]) => {
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
          });
        });
      });
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

    const allFeatures: { geometry: { type: string; coordinates: number[] | number[][] | number[][][] | number[][][][] } }[] = [];
    
    if (data?.features) {
      allFeatures.push(...data.features);
    }
    
    if (mission?.features) {
      allFeatures.push(...mission.features);
    }

    if (allFeatures.length === 0) return;

    const bounds = getBoundsFromFeatures(allFeatures);
    
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [100, 100] });
      setTimeout(() => {
        const currentZoom = map.getZoom();
        if (currentZoom > 16) {
          map.setZoom(16);
        }
      }, 100);
    }
  }, [data, mission, map]);

  return null;
}

export default function MapView(): JSX.Element {
  const [mission, setMission] = useState<GeoJsonData | null>(null);
  const [data, setData] = useState<GeoJsonData | null>(null);

  useEffect(() => {
    fetchMission().then(setMission);
    fetchData().then(setData);
  }, []);

  const onEachFeature = (feature: { properties: Record<string, unknown> }, layer: L.Layer): void => {
    const props = feature.properties || {};
    const propsHtml = Object.entries(props)
      .map(([k, v]) => `<strong>${k}:</strong> ${v ?? "N/A"}`)
      .join("<br/>");
    
    layer.bindPopup(propsHtml);
    
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        const popup = targetLayer.getPopup();
        if (popup) {
          const mapObj = (layer as unknown as { _map: L.Map })._map;
          if (mapObj) {
            popup.setLatLng(e.latlng).openOn(mapObj);
          }
        }
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        (e.target as L.Path).closePopup();
      }
    });
  };

  const filterByGeomType = (geoJson: GeoJsonData | null, geomType: string): GeoJsonData | null => {
    if (!geoJson) return null;
    const filtered = geoJson.features.filter(f => f.geometry?.type === geomType);
    if (filtered.length === 0) return null;
    return {
      ...geoJson,
      features: filtered
    };
  };

  const filterByLayer = (geoJson: GeoJsonData | null, layerName: string): GeoJsonData | null => {
    if (!geoJson) return null;
    const filtered = geoJson.features.filter(f => f.properties?.layer === layerName);
    if (filtered.length === 0) return null;
    return {
      ...geoJson,
      features: filtered
    };
  };

  const poleStyle: L.CircleMarkerOptions = { color: "#6A1B9A", fillColor: "#6A1B9A", fillOpacity: 0.7, weight: 1, radius: 5 };
  const fenceStyle: L.PathOptions = { color: "#546E7A", weight: 2, dashArray: "8, 6", fillOpacity: 0 };
  const obstacleStyle: L.PathOptions = { color: "#C62828", fillColor: "#EF5350", fillOpacity: 0.35, weight: 1.5 };
  const panelStyle: L.PathOptions = { color: "#5D4037", fillColor: "#8D6E63", fillOpacity: 0.4, weight: 1.5 };
  const stationStyle: L.CircleMarkerOptions = { color: "#EF6C00", fillColor: "#FFB74D", fillOpacity: 0.7, weight: 1, radius: 7 };
  const missionNodeStyle: L.CircleMarkerOptions = { color: "#1565C0", fillColor: "#64B5F6", fillOpacity: 0.8, weight: 1, radius: 5 };
  const missionEdgeStyle: L.PathOptions = { color: "#2E7D32", weight: 2.5 };

  return (
    <MapContainer
      center={[52.4277, 5.6909]}
      zoom={16}
      style={{ height: "100vh" }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomControl position="topright" />
      <ScaleControl position="bottomleft" />

      <LayersControl position="topright">

        <Overlay checked name="Poles">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "poles")!}
              style={poleStyle}
              pointToLayer={(_f, latlng) => L.circleMarker(latlng, poleStyle)}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Fences">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "fences")!}
              style={fenceStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Obstacles">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "obstacles")!}
              style={obstacleStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Panels">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "panels")!}
              style={panelStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Station">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "station")!}
              style={stationStyle}
              pointToLayer={(_f, latlng) => L.circleMarker(latlng, stationStyle)}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Nodes">
          {mission && (
            <GeoJSON
              data={filterByGeomType(mission, "Point")!}
              style={missionNodeStyle}
              pointToLayer={(_f, latlng) => L.circleMarker(latlng, missionNodeStyle)}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Edges">
          {mission && (
            <GeoJSON
              data={filterByGeomType(mission, "LineString")!}
              style={missionEdgeStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

      </LayersControl>

      <FitBoundsToData data={data} mission={mission} />
    </MapContainer>
  );
}
