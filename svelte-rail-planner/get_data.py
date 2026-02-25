"""train"""

import sys
from os.path import join
import math
import gzip
import io
import csv
import json
from requests import get

PATH_TO_JSON = "src/assets/json/"


def post_clean_ter(data):
    """post cleaning function"""
    for one_entry in data:
        code = one_entry["Origine - code UIC"]
        one_entry["origine_code_uic"] = code
        one_entry.pop("Origine - code UIC")
        code = one_entry["Destination - code UIC"]
        one_entry["destination_code_uic"] = code
        one_entry.pop("Destination - code UIC")
    return data


OPEN_DATA_SNCF = "https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/"
PARAMS = "?lang=fr&timezone=Europe%2FBerlin"


def get_data(out_folder):
    """download data"""
    urls = {
        "tarifs-ter-par-od.json": [
            {
                # don't work anymore :(
                "url": f"{OPEN_DATA_SNCF}tarifs-ter-par-od/exports/json{PARAMS}"
            },
            {
                "url": "https://files.opendatarchives.fr/data.sncf.com/tarifs-ter-par-od.csv.gz",
                "post": post_clean_ter,
            },
        ],
        "tarifs-intercites.json": [
            {"url": f"{OPEN_DATA_SNCF}tarifs-intercites/exports/json{PARAMS}"}
        ],
        "gares-de-voyageurs.json": [
            {"url": f"{OPEN_DATA_SNCF}gares-de-voyageurs/exports/json{PARAMS}"}
        ],
        "tarifs-tgv-inoui-ouigo.json": [
            {"url": f"{OPEN_DATA_SNCF}tarifs-tgv-inoui-ouigo/exports/json{PARAMS}"}
        ],
    }
    filenames = []
    for fname, urls_list in urls.items():
        for one_src in urls_list:
            file_url = one_src["url"]
            response = get(file_url, timeout=10)
            if not response.ok:
                print(f"Request failed for {file_url}")
                continue
            if file_url.endswith(".gz"):
                with gzip.GzipFile(fileobj=io.BytesIO(response.content)) as gz:
                    decoded = gz.read().decode("utf-8")
                file_url = file_url.removesuffix(".gz")
            else:
                decoded = response.json()
            if file_url.endswith(".csv"):
                csv_reader = csv.DictReader(io.StringIO(decoded), delimiter=";")
                data = list(csv_reader)
            else:
                data = decoded
            if "post" in one_src:
                data = one_src["post"](data)
            fname = join(out_folder, fname)
            with open(fname, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Downloaded {fname}")
            filenames.append(fname)
    return filenames


def load_json(filename):
    """load json file"""
    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
    return data


def min_distance(g_keys, dist, spt_set):
    # Initialize minimum distance for next node
    min_dist = float("inf")
    min_index = None

    # Search for the nearest vertex not in the
    # shortest path tree
    for v in g_keys:
        if dist[v] < min_dist and not spt_set[v]:
            min_dist = dist[v]
            min_index = v

    return min_index


def get_dist_between(gares, start_uic, end_uic):
    """dist between gares"""
    start_g = gares[start_uic]
    end_g = gares[end_uic]
    return math.dist(
        [
            start_g["position_geographique"]["lon"],
            start_g["position_geographique"]["lat"],
        ],
        [
            end_g["position_geographique"]["lon"],
            end_g["position_geographique"]["lat"],
        ],
    )


def travel_paths(gares, orig):
    g_keys = list(gares.keys())
    dest_by_gare = get_dest_by_gares()
    dist = dict.fromkeys(g_keys, float("inf"))
    dist[orig] = 0
    sptSet = dict.fromkeys(g_keys, False)
    path = {orig: None}

    for _cout in range(len(g_keys)):
        # Pick the minimum distance vertex from
        # the set of vertices not yet processed.
        u = min_distance(g_keys, dist, sptSet)

        # Put the minimum distance vertex in the
        # shortest path tree
        sptSet[u] = True

        # Update dist value of the adjacent vertices
        # of the picked vertex only if the current
        # distance is greater than new distance and
        # the vertex is not in the shortest path tree
        if u in dest_by_gare:
            for one_gare in dest_by_gare[u]:
                if one_gare in sptSet and not sptSet[one_gare]:
                    new_dist = dist[u] + get_dist_between(gares, u, one_gare)
                    if dist[one_gare] > new_dist:
                        dist[one_gare] = new_dist
                        path[one_gare] = u
    return dist, path


def print_gare(gares, gare_to_print):
    g = gares[gare_to_print]
    print(g)
    return g


def get_path(paths, orign, dest):
    path_final = [dest]
    res = dest
    while res != orign:
        res = paths[res]
        path_final.append(res)
    path_final.reverse()
    return path_final


def gares_from_final_path(gares, final):
    return [gares[x]["nom"] for x in final]


def get_dest_by_gares():
    ter_tarifs = load_json(f"{PATH_TO_JSON}/tarifs-ter-par-od.json")
    dest_by_gare = {}
    for one_tarif in ter_tarifs:
        orig_uic = one_tarif["origine_code_uic"]
        dest_uic = one_tarif["destination_code_uic"]
        if orig_uic not in dest_by_gare:
            dest_by_gare[orig_uic] = []
        if dest_uic not in dest_by_gare[orig_uic]:
            dest_by_gare[orig_uic].append(dest_uic)
    intercite_tarifs = load_json(f"{PATH_TO_JSON}/tarifs-intercites.json")
    for one_tarif in intercite_tarifs:
        orig_uic = one_tarif["origine_uic8"]
        dest_uic = one_tarif["destination_uic8"]
        if orig_uic not in dest_by_gare:
            dest_by_gare[orig_uic] = []
        if dest_uic not in dest_by_gare[orig_uic]:
            dest_by_gare[orig_uic].append(dest_uic)

    return dest_by_gare


def check_is_possible(gares, dest_by_gare, paths):
    current_gare = paths[0]
    for one_path in paths[1:]:
        if one_path not in dest_by_gare[current_gare]:
            print(
                gares[one_path]["nom"],
                "not in dest of gare ",
                gares[current_gare]["nom"],
            )
            print_dest_of(gares, dest_by_gare, current_gare)
            return False
        current_gare = one_path
    return True


def print_dest_of(gares, dest_by_gare, current):
    """print dest of"""
    arr = dest_by_gare[current]
    pat = gares_from_final_path(gares, arr)
    print(f"Accessible gare from {gares[current]['nom']} are")
    print(pat)


def test():
    """tiny unit test"""
    gares = load_json(f"{PATH_TO_JSON}/gares-de-voyageurs.json")
    gares = {one_gare["codes_uic"]: one_gare for one_gare in gares}
    dest_by_gare = get_dest_by_gares()
    orig = "87781278"
    dest = "87182055"
    print_gare(gares, orig)
    print("to")
    print_gare(gares, dest)
    res, paths = travel_paths(gares, orig)
    # print(paths)
    res = dict(sorted(res.items(), key=lambda item: item[1]))
    print(res[dest], "(dist total)")
    print(get_dist_between(gares, orig, dest))
    final = get_path(paths, orig, dest)
    print(final)
    print(gares_from_final_path(gares, final))
    assert check_is_possible(gares, dest_by_gare, final)
    print("----------")
    check = [
        orig,
        "87765008",
        "87751008",
        "87723197",
        "87713545",
        "87713040",
        "87718007",
        "87184002",
        dest,
    ]
    print(check)
    print(gares_from_final_path(gares, check))
    assert check_is_possible(gares, dest_by_gare, check)


def main():
    """main function"""
    if len(sys.argv) > 1:
        print("Downloading data")
        get_data(PATH_TO_JSON)
    else:
        print("Using existing data, to download data use 'python get_data.py download'")
        test()


if __name__ == "__main__":
    main()
