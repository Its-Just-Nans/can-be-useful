"""python_download_google_drive"""

import os
from pathlib import Path
import pandas as pd
import gdown
from PIL import Image

# -------- CONFIG --------
CSV_FILE = "file.csv"
OUTPUT_DIR = "images_jpg"
IMAGE_COLUMN = "Ma photo / My picture"
NEW_COLUMN = "Image filename"
JPG_QUALITY = 95
OUTPUT_CSV = "responses_with_filenames.csv"
# ------------------------

os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(CSV_FILE)
df.columns = df.columns.str.strip()
df[NEW_COLUMN] = ""


def extract_file_id(url):
    if isinstance(url, str) and "id=" in url:
        return url.split("id=")[1]
    return None


def safe_filename(text):
    return str(text).strip().replace(" ", "_").replace("/", "_")


for index, row in df.iterrows():
    url = row[IMAGE_COLUMN]

    if pd.isna(url):
        continue

    file_id = extract_file_id(url)
    if not file_id:
        print(f"❌ Invalid URL: {url}")
        continue

    first_name = safe_filename(row["Prénom / Name"])
    last_name = safe_filename(row["Nom / Surname"])
    final_filename = f"{first_name}_{last_name}.jpg"
    print(first_name, url)
    final_path = os.path.join(OUTPUT_DIR, final_filename)

    temp_path = os.path.join(OUTPUT_DIR, f"temp_{index}")

    df.at[index, NEW_COLUMN] = f"{final_filename}"
    if Path(final_path).exists():
        print(f"{first_name} is already here")
        continue

    try:
        gdown.download(
            f"https://drive.google.com/uc?export=download&id={file_id}",
            temp_path,
            quiet=False,
        )
    except Exception as e:
        print(f"gdown failed: {e}")
        continue

    try:
        with Image.open(temp_path) as img:
            img = img.convert("RGB")
            img.save(final_path, "JPEG", quality=JPG_QUALITY, subsampling=0)

        print(f"✅ Saved {final_filename}")

    except Exception as e:
        print(f"❌ Error processing image {index}: {e}")

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

df.to_csv(OUTPUT_CSV, index=False)

print(f"\n📄 Updated CSV saved as: {OUTPUT_CSV}")
print("🎉 All images processed!")
