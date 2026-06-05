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
            if not filename.startswith("chance_tickets_hands") and \
               not filename.startswith("lottery_drawing_machine") and \
               not filename.startswith("stacks_of_cash") and \
               not filename.startswith("ticket_letters") and \
               not filename.startswith("split_screen_vendor") and \
               not filename.startswith("bank_teller_tickets"):
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
