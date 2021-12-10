import geopandas as gpd

boundary = gpd.read_file("../Shapefiles/Washington_DC_Boundary.shp")
boundary.to_file("../GeoJSON/Washington_DC_Boundary.geojson", driver="GeoJSON")

neighborhoods = gpd.read_file("../Shapefiles/Neighborhood_Clusters.shp")
neighborhoods.to_file("../GeoJSON/Neighborhood_Clusters.geojson", driver="GeoJSON")