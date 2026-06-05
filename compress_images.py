import os
import glob
from PIL import Image

def convert_to_webp(folder_path):
    print(f"Compressing images in {folder_path}...")
    png_files = glob.glob(os.path.join(folder_path, '*.png'))
    
    for png_path in png_files:
        try:
            # We only want to convert the ones we generated (they have a timestamp at the end)
            filename = os.path.basename(png_path)
            if not filename.startswith("billete_panama_strip") and \
               not filename.startswith("fraction_vs_strip") and \
               not filename.startswith("hand_placing_strip") and \
               not filename.startswith("payment_agency_window") and \
               not filename.startswith("payout_table_screen") and \
               not filename.startswith("series_folio_pointer"):
                continue

            img = Image.open(png_path)
            img = img.convert('RGB') # WebP doesn't need alpha for these photos
            webp_path = png_path.replace('.png', '.webp')
            
            # Save as WebP with 75% quality
            img.save(webp_path, 'WEBP', quality=75, optimize=True)
            
            # Delete original heavy PNG
            os.remove(png_path)
            
            print(f"Converted {filename} -> {os.path.basename(webp_path)}")
            
        except Exception as e:
            print(f"Error on {png_path}: {e}")

if __name__ == "__main__":
    convert_to_webp(r"C:\Users\Dell\Downloads\LOTERIA\lotteryx-landing\images")
