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
    
    layer.bindPopup(propsHtml, {
      closeButton: false,
      className: 'custom-popup'
    });
    
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

  const poleStyle: L.CircleMarkerOptions = { color: "#8b5cf6", fillColor: "#8b5cf6", fillOpacity: 0.85, weight: 1, radius: 5 };
  const fenceStyle: L.PathOptions = { color: "#64748b", weight: 2.5, dashArray: "10, 8", fillOpacity: 0 };
  const obstacleStyle: L.PathOptions = { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.4, weight: 1.5 };
  const panelStyle: L.PathOptions = { color: "#eab308", fillColor: "#eab308", fillOpacity: 0.45, weight: 1.5 };
  const stationStyle: L.CircleMarkerOptions = { color: "#ec4899", fillColor: "#ec4899", fillOpacity: 0.85, weight: 1, radius: 8 };
  const missionNodeStyle: L.CircleMarkerOptions = { color: "#00d4aa", fillColor: "#00d4aa", fillOpacity: 0.9, weight: 1, radius: 5 };
  const missionEdgeStyle: L.PathOptions = { color: "#22c55e", weight: 2.5 };

  return (
    <MapContainer
      center={[52.4277, 5.6909]}
      zoom={16}
      style={{ height: "100%", flex: 1 }}
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

      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
      }}>
        <ZoomControl position="topright"  />
      </div>

      <ScaleControl position="bottomleft" />

      <FitBoundsToData data={data} mission={mission} />
    </MapContainer>
  );
}
