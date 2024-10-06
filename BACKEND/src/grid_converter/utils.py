import matplotlib.pyplot as plt
import rasterio
from pyproj import Transformer
import os



def create_grid(longitude, latitude):
    current_dir = os.path.dirname(__file__)

    file_path = os.path.join(current_dir, 'LC08_L2SP_186025_20240924_20240928_02_T1_ST_B10.TIF')

    output_path = os.path.join(current_dir, 'results')

    with rasterio.open(file_path) as src:
        raster_crs = src.crs

        transformer = Transformer.from_crs("EPSG:4326", raster_crs, always_xy=True)

        lon, lat = 21.654052734375004, 50.61461743826628

        transformed_x, transformed_y = transformer.transform(lon, lat)

        target_pixel_x, target_pixel_y = src.index(transformed_x, transformed_y)


        window = ((target_pixel_y - 1, target_pixel_y + 2), (target_pixel_x - 1, target_pixel_x + 2))
          = src.read(1, window=window)

        new_profile = src.profile.copy()
        new_profile.update({
            "height": 3,
            "width": 3,
            "transform": src.window_transform(window),
            "driver": "GTiff"  # Ensure GeoTIFF format
        })

        # Save the extracted window as a new GeoTIFF file
        with rasterio.open(output_path, 'w', **new_profile) as dst:
            dst.write(pixel_values, 1)  # Write data to band 1

    # fig, ax = plt.subplots()
    # cax = ax.matshow(pixel_values, cmap='viridis')
    #
    # # Annotate the grid with pixel values
    # for i in range(3):
    #     for j in range(3):
    #         ax.text(j, i, str(pixel_values[i, j]), va='center', ha='center')
    #
    # ax.set_title('3x3 Grid of Landsat Pixels')
    # plt.colorbar(cax)
    #
    # # Save the plot as an image file
    # plt.savefig(output_path)
    # plt.close()