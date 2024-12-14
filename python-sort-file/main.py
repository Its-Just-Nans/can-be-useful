#!/bin/python

"""_summary_
import and clean a file
"""

from json import load, dump

name = input("name of file ?\n")

with open(name, "r", encoding="utf-8") as f:
    data = load(f)

seen = set()
new_l = []
for d in data:
    a = d["title"] + " - " + d["artist"]["name"]
    if a not in seen:
        seen.add(a)
        new_l.append(d)
    else:
        print(f"{a} is already present !")

sensible = ["cover_xl", "nb_tracks", "release_date", "record_type"]
for d in new_l:
    try:
        t = {
            "id": d["id"],
            "title": d["title"],
            "link": d["link"],
            "artist": {
                "id": d["artist"]["id"],
                "name": d["artist"]["name"],
                "picture_xl": d["artist"]["picture_xl"]
                if "picture_xl" in d["artist"]
                else "",
                "type": d["artist"]["type"],
            },
            "type": d["type"],
        }
        for one_sensible in sensible:
            if one_sensible in d:
                t[one_sensible] = d[one_sensible]
        if "album" in d:
            if isinstance(d["album"], list):
                t["album"] = []
                for one_album in d["album"]:
                    t["album"].append(
                        {
                            "id": one_album["id"],
                            "title": one_album["title"],
                            "cover_xl": one_album["cover_xl"],
                            "type": one_album["type"],
                        }
                    )
            else:
                one_album = d["album"]
                t["album"] = {
                    "id": one_album["id"],
                    "title": one_album["title"],
                    "cover_xl": one_album["cover_xl"],
                    "type": one_album["type"],
                }
    except Exception as e:  # pylint: disable=broad-except
        print(e, d["title"])
        continue

with open(name, "w", encoding="utf-8") as file:
    dump(new_l, file, indent=4, sort_keys=True)
