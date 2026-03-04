import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  useMap
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { fetchMission, fetchData } from "../services/dataService";

const { Overlay } = LayersControl;

function FitBounds({ layers }) {
  const map = useMap();

  useEffect(() => {
    if (!layers.length) return;

    const group = new L.featureGroup(layers);
    if (group.getBounds().isValid()) {
      map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }
  }, [layers, map]);

  return null;
}

function GeoJsonLayer({ data, style, name, checked = true, layerFilter = null }) {
  const [leafletLayers, setLeafletLayers] = useState([]);

  const onEachFeature = (feature, layer) => {
    const props = feature.properties || {};
    const propsHtml = Object.entries(props)
      .map(([k, v]) => `<strong>${k}:</strong> ${v ?? "N/A"}`)
      .join("<br/>");
    layer.bindPopup(propsHtml);

    setLeafletLayers(prev => [...prev, layer]);
  };

  let filteredData = data;
  if (data && layerFilter) {
    const features = data.features.filter(layerFilter);
    filteredData = { ...data, features };
  }

  if (!filteredData || !filteredData.features?.length) return null;

  return (
    <GeoJSON
      data={filteredData}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}

export default function MapView() {
  const [mission, setMission] = useState(null);
  const [data, setData] = useState(null);
  const [leafletLayers, setLeafletLayers] = useState([]);

  useEffect(() => {
    fetchMission().then(setMission);
    fetchData().then(setData);
  }, []);

  const onEachFeature = (feature, layer) => {
    const props = feature.properties || {};
    const propsHtml = Object.entries(props)
      .map(([k, v]) => `<strong>${k}:</strong> ${v ?? "N/A"}`)
      .join("<br/>");
    layer.bindPopup(propsHtml);
    setLeafletLayers(prev => [...prev, layer]);
  };

  const filterByGeomType = (data, geomType) => {
    if (!data) return null;
    return {
      ...data,
      features: data.features.filter(f => f.geometry?.type === geomType)
    };
  };

  const filterByLayer = (data, layerName) => {
    if (!data) return null;
    return {
      ...data,
      features: data.features.filter(f => f.properties?.layer === layerName)
    };
  };

  const pointStyle = { color: "blue", radius: 5 };
  const lineStyle = { color: "green", weight: 2 };
  const polygonStyle = { color: "black", fillOpacity: 0.3 };
  const poleStyle = { color: "purple", radius: 4 };

  return (
    <MapContainer
      center={[52.4277, 5.6909]}
      zoom={16}
      style={{ height: "100vh" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LayersControl position="topright">

        <Overlay checked name="Poles">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "poles")}
              style={poleStyle}
              pointToLayer={(f, latlng) => L.circleMarker(latlng, poleStyle)}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Fences">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "fences")}
              style={{ color: "gray", weight: 1, fillOpacity: 0.1 }}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Obstacles">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "obstacles")}
              style={{ color: "red", fillOpacity: 0.5 }}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Panels">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "panels")}
              style={{ color: "brown", fillOpacity: 0.4 }}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Stations">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "stations")}
              style={{ color: "orange", radius: 6 }}
              pointToLayer={(f, latlng) => L.circleMarker(latlng, { color: "orange", radius: 6 })}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Compact Stations">
          {data && (
            <GeoJSON
              data={filterByLayer(data, "compactstations")}
              style={{ color: "magenta", radius: 5 }}
              pointToLayer={(f, latlng) => L.circleMarker(latlng, { color: "magenta", radius: 5 })}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Mission Nodes">
          {mission && (
            <GeoJSON
              data={filterByGeomType(mission, "Point")}
              style={{ color: "blue", radius: 4 }}
              pointToLayer={(f, latlng) => L.circleMarker(latlng, { color: "blue", radius: 4, fillColor: "blue", fillOpacity: 1 })}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

        <Overlay checked name="Mission Edges">
          {mission && (
            <GeoJSON
              data={filterByGeomType(mission, "LineString")}
              style={{ color: "green", weight: 2 }}
              onEachFeature={onEachFeature}
            />
          )}
        </Overlay>

      </LayersControl>

      <FitBounds layers={leafletLayers} />
    </MapContainer>
  );
}
