from bing_image_downloader import downloader
import os
import shutil

query_string = "billetes loteria nacional de panama chance"

downloader.download(query_string, limit=5,  output_dir='dataset', adult_filter_off=True, force_replace=False, timeout=60)

print("Downloaded images:")
for root, dirs, files in os.walk("dataset"):
    for file in files:
        print(os.path.join(root, file))
