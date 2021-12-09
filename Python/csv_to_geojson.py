import pandas as pd 
import geopandas as gpd 

from shapely.geometry import Point


df = pd.read_csv('../CSV/Liquor_Licenses.csv')

df = df[['OBJECTID','LONGITUDE','LATITUDE','TRADE_NAME','ADDRESS',
         'CLASS','TYPE', 'WARD','ZIPCODE','TOTAL_CAPACITY']]
gdf = gpd.GeoDataFrame(
    df, geometry=gpd.points_from_xy(x=df.LONGITUDE, y=df.LATITUDE)
)

gdf.to_file("../GeoJSON/liquor.geojson", driver="GeoJSON")

