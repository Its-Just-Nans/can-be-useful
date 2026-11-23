import requests
import math
import os
import time
import sys
import xml.etree.ElementTree as ET

from PIL import Image
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor, as_completed

def main():
    BASE_URL = sys.argv[1]
    OUTPUT_FILE = "map_max_resolution.jpg"
    DOWNLOAD_DIR = "chart_tiles"

    THREADS = 8
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0"
    })

    print("Reading chart properties...")

    response = session.get(
        BASE_URL + "ImageProperties.xml",
        timeout=30
    )

    response.raise_for_status()

    root = ET.fromstring(response.content)

    width = int(root.attrib["WIDTH"])
    height = int(root.attrib["HEIGHT"])
    tile_size = int(root.attrib["TILESIZE"])

    print("Chart dimensions:", width, "x", height)
    print("Tile size:", tile_size)

    levels = []

    w = width
    h = height

    while True:
        cols = math.ceil(w / tile_size)
        rows = math.ceil(h / tile_size)
        levels.append((cols, rows))
        if cols == 1 and rows == 1:
            break
        w = w // 2
        h = h // 2

    # Reverse: lowest resolution first
    levels.reverse()

    max_zoom = len(levels) - 1

    print("Maximum zoom level:", max_zoom)

    cols, rows = levels[max_zoom]

    print("Maximum zoom tiles:", cols, "x", rows)

    def get_tile_group(z, x, y):
        index = x + y * levels[z][0]
        for i in range(z):
            index += levels[i][0] * levels[i][1]
        return index // 256

    def download_tile(x, y):
        z = max_zoom
        group = get_tile_group(z, x, y)
        filename = f"{z}-{x}-{y}.jpg"
        url = (
            f"{BASE_URL}"
            f"TileGroup{group}/"
            f"{filename}"
        )
        path = os.path.join(DOWNLOAD_DIR, filename)
        if os.path.exists(path):
            try:
                img = Image.open(path).convert("RGB")
                img.load()
                return x, y, img
            except Exception:
                print("Corrupted cached tile:", filename)
                os.remove(path)
        for attempt in range(3):
            try:
                r = session.get(url, timeout=30)
                if r.status_code != 200:
                    return x, y, None
                img = Image.open(BytesIO(r.content))
                img.load()
                img = img.convert("RGB")
                img.save(path, quality=95)
                return x, y, img
            except Exception as _e:
                time.sleep(1)
        print("Failed:", filename)
        return x, y, None

    print("\nDownloading maximum-resolution tiles...")

    tiles = {}

    tasks = []

    with ThreadPoolExecutor(max_workers=THREADS) as executor:
        for y in range(rows):
            for x in range(cols):
                tasks.append(
                    executor.submit(download_tile, x, y)
                )
        for i, future in enumerate(as_completed(tasks), 1):
            x, y, img = future.result()
            if img is not None:
                tiles[(x, y)] = img
            if i % 20 == 0 or i == len(tasks):
                print(
                    f"Downloaded {i}/{len(tasks)} "
                    f"({len(tiles)} successful)"
                )


    print("\nCombining chart tiles...")

    final_image = Image.new(
        "RGB",
        (width, height),
        "white"
    )
    for (x, y), img in tiles.items():
        px = x * tile_size
        py = y * tile_size
        final_image.paste(img, (px, py))

    print("\nSaving final chart...")

    final_image.save(
        OUTPUT_FILE,
        "JPEG",
        quality=95,
        subsampling=0
    )

    print("\nCOMPLETE!")
    print("Output:", OUTPUT_FILE)
    print("Dimensions:", final_image.size)
    print("Tiles downloaded:", len(tiles))
    print("Tiles expected:", cols * rows)

if __name__ == "__main__":
    main()
