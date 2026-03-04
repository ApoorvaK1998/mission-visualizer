import geopandas as gpd
import fiona
import os

OUTPUT_DIR = "../backend/MissionVisualizer.Api/wwwroot/data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def convert_gpkg():


    gpkg_path = os.path.join(os.path.dirname(__file__), "biddinghuizen.gpkg")

    layers = fiona.listlayers(gpkg_path)

    for layer in layers:
        print(f"Reading layer: {layer}")

        gdf = gpd.read_file(gpkg_path, layer=layer)

        # Convert from EPSG:28992 → 4326
        gdf = gdf.to_crs(epsg=4326)

        output = os.path.join(OUTPUT_DIR, f"{layer}.geojson")
        gdf.to_file(output, driver="GeoJSON")

        print(f"Converted layer: {layer}")

def convert_mission():
    mission_path = "../biddinghuizen_mission_utm.geojson"

    gdf = gpd.read_file(mission_path)

    # Convert from EPSG:32631 → 4326
    gdf = gdf.to_crs(epsg=4326)

    output = os.path.join(OUTPUT_DIR, "mission.geojson")
    gdf.to_file(output, driver="GeoJSON")

    print("Converted mission file")

if __name__ == "__main__":
    convert_gpkg()
    convert_mission()