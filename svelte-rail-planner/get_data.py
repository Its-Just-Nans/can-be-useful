"""train"""

import sys
from os.path import join
import math
import json
from requests import get

PATH_TO_JSON = "src/assets/json/"


def get_data(out_folder):
    """download data"""
    urls = {
        "https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tarifs-intercites/exports/json?lang=fr&timezone=Europe%2FBerlin": "tarifs-intercites.json",
        # don't work anymore :(
        "https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tarifs-ter-par-od/exports/json?lang=fr&timezone=Europe%2FBerlin": "tarifs-ter-par-od.json",
        "https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/gares-de-voyageurs/exports/json?lang=fr&timezone=Europe%2FBerlin": "gares-de-voyageurs.json",
        "https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/tarifs-tgv-inoui-ouigo/exports/json?lang=fr&timezone=Europe%2FBerlin": "tarifs-tgv-inoui-ouigo.json",
    }
    filenames = []
    for one_url, fname in urls.items():
        resp = get(one_url, timeout=10)
        fname = join(out_folder, fname)
        with open(fname, "wb") as f:
            f.write(resp.content)
        print(f"Downloaded {fname}")
        filenames.append(fname)
    return filenames


def load_json(filename):
    """load json file"""
    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
    return data


def minDistance(g_keys, dist, sptSet):
    # Initialize minimum distance for next node
    min_dist = float("inf")
    min_index = None

    # Search for the nearest vertex not in the
    # shortest path tree
    for v in g_keys:
        if dist[v] < min_dist and not sptSet[v]:
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
        u = minDistance(g_keys, dist, sptSet)

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
    arr = dest_by_gare[current]
    pat = gares_from_final_path(gares, arr)
    print(f"Accessible gare from {gares[current]['nom']} are")
    print(pat)


def test():
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
    if len(sys.argv) > 1:
        print("Downloading data")
        get_data(PATH_TO_JSON)
    else:
        print("Using existing data, to download data use 'python get_data.py download'")
        test()


if __name__ == "__main__":
    main()
