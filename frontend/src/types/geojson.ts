export interface GeoJsonProperties {
  id?: number | string;
  layer?: string;
  type?: string;
  [key: string]: unknown;
}

export interface GeoJsonFeature {
  type: "Feature";
  properties: GeoJsonProperties;
  geometry: GeoJsonGeometry;
}

export interface GeoJsonGeometry {
  type: "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";
  coordinates: number[] | number[][] | number[][][] | number[][][][];
}

export interface GeoJsonData {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}
