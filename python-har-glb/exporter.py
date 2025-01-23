from json import load
from urllib.parse import urlparse
from os.path import basename, join, exists
from os import mkdir
from hashlib import sha256
from base64 import b64decode
import sys


def decode(folder, filename):
    """main func"""
    with open(filename, "r", encoding="utf-8") as fp:
        json = load(fp)

    if not exists(folder):
        mkdir(folder)

    for one_entry in json["log"]["entries"]:
        url = one_entry["request"]["url"]
        parsed_url = urlparse(url)
        filename = basename(parsed_url.path)
        if filename.endswith(".glb"):
            hashing = sha256(filename.encode("UTF-8"))
            new_name = f"{hashing.hexdigest()}.glb"
            print(f"filename: {filename} {new_name}")
            if "content" not in one_entry["response"]:
                continue
            if "text" not in one_entry["response"]["content"]:
                continue
            file_encoded = one_entry["response"]["content"]["text"]
            with open(join(folder, new_name), "wb") as fp:
                fp.write(b64decode(file_encoded))


if __name__ == "__main__":
    OUT = "data"
    decode(OUT, sys.argv[1])
    print(f"cd {OUT}")
    print("npm install --global @gltf-transform/cli")
    print("gltf-transform merge * out.glb --merge-scenes")
