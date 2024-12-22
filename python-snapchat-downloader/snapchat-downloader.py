""" simple snapchat downloader """
from pathlib import Path
from os.path import join
from json import load
from requests import get, post
from concurrent.futures import ThreadPoolExecutor

CONNECTIONS = 40

path_to_file = 'memories_history.json'
if not Path(path_to_file).is_file():
    print("File not found :( Are you in the correct directory?")
    exit()

Path("memories").mkdir(parents=True, exist_ok=True)

with open(path_to_file, encoding="utf-8") as f:
    data = load(f)


def get_media(oneLink):
    """ get media """
    response = post(oneLink["Download Link"])
    newURL = response.content
    a = get(newURL)
    type = oneLink["Media Type"].lower()
    if type == "image":
        name = f'{oneLink["Date"].split(" ")[0]}_{type}.jpg'
    elif type == "video":
        name = f'{oneLink["Date"].split(" ")[0]}_{type}.mp4'
    print(f'Downloading {name}')
    open(join('memories', name), "wb").write(a.content)


with ThreadPoolExecutor(max_workers=CONNECTIONS) as executor:
    executor.map(get_media, data["Saved Media"])
