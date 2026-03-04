import { GeoJsonData } from "../types/geojson";

export async function fetchMission(): Promise<GeoJsonData> {
  const res = await fetch("http://localhost:5000/api/data/mission");
  return res.json();
}

export async function fetchData(): Promise<GeoJsonData> {
  const res = await fetch("http://localhost:5000/api/data/park/data");
  return res.json();
}
