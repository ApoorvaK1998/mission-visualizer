import { GeoJsonData } from "../types/geojson";

const API_BASE = "http://localhost:5000/api/data";

export async function fetchMission(): Promise<GeoJsonData> {
  const res = await fetch(`${API_BASE}/mission`);
  if (!res.ok) {
    throw new Error(`Failed to fetch mission: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchData(): Promise<GeoJsonData> {
  const res = await fetch(`${API_BASE}/park/data`);
  if (!res.ok) {
    throw new Error(`Failed to fetch park data: ${res.statusText}`);
  }
  return res.json();
}
