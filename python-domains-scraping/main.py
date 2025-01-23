"""
domains names scraping with OVH API
https://github.com/Its-Just-Nans/domains-scrapping
"""


import re
from json import loads, JSONDecodeError
from array_cache import ArrayCache
import grequests
import requests


def print_if(msg):
    """print if"""
    if PRINT_BAD_NEWS:
        print(msg)


def get_url(current_cart_id, domain):
    """get url"""
    return (
        f"https://api.ovh.com/1.0/order/cart/{current_cart_id}/domain?domain={domain}"
    )


def check_result(data, domain):
    """check results"""
    if isinstance(data, dict):
        print_if(f"domain : {domain} {data['message']}")
        return
    if isinstance(data, list) and len(data) > 0 and "action" in data[0]:
        if data[0]["action"] == "create":
            p = data[0]["prices"][0]["price"]["value"]
            print(f"domain : {domain} {p}{'<------------' if p < MAX_PRICE else ''}")
        else:
            print_if(f"domain : {domain} {data[0]['action']}")
    else:
        print_if(f"domain : {domain} API -> {data}")


def get_cart_id(ovh_subsidiary):
    """get a new cart ID"""
    r = requests.post(
        "https://api.ovh.com/1.0/order/cart",
        json={"ovhSubsidiary": ovh_subsidiary},
        timeout=5,
    )
    res = r.json()
    return res["cartId"]


def pre_filter(file_to_filter):
    """filter word which have only 4 letters"""
    words = re.sub(r"[^\w]", " ", file_to_filter.read()).split()
    words = [word for word in words if len(word) <= MAX_SIZE_WORD]
    words.reverse()
    words = list(dict.fromkeys(words))
    return words


def main(
    extensions,
    ovh_subsidiary="FR",
    words_file_path="/usr/share/dict/words",
):
    """main"""
    cart_id = get_cart_id(ovh_subsidiary)
    with open(words_file_path, "r", encoding="utf-8") as file:
        data_array = pre_filter(file)
    cached_words = ArrayCache(data_array, "my-identifier", 5)
    for one_word in cached_words.get_data():
        rs = (
            grequests.get(get_url(cart_id, f"{one_word.lower()}.{one_ext.lower()}"))
            for one_ext in extensions
        )
        for one_res in grequests.map(rs):
            domain = one_res.url.split("=")[-1]
            data_of_domain = one_res.json()
            check_result(data_of_domain, domain)


PRINT_BAD_NEWS = False
MAX_PRICE = 25
MAX_SIZE_WORD = 4

if __name__ == "__main__":
    with open("config.json", "r", encoding="utf-8") as config_file:
        try:
            config = loads(config_file.read())
        except JSONDecodeError:
            config = {
                "OVH_SUBSIDIARY": "FR",
                "EXTENSIONS": ["org", "net"],
                "PRINT_BAD_NEWS": PRINT_BAD_NEWS,
                "MAX_PRICE": MAX_PRICE,
                "MAX_SIZE_WORD": MAX_SIZE_WORD,
                "WORDS_FILE_PATH": "/usr/share/dict/words",
            }
    PRINT_BAD_NEWS = config["PRINT_BAD_NEWS"]
    MAX_PRICE = config["MAX_PRICE"]
    MAX_SIZE_WORD = config["MAX_SIZE_WORD"]
    main(
        config["EXTENSIONS"],
        config["OVH_SUBSIDIARY"],
        words_file_path=config["WORDS_FILE_PATH"],
    )
