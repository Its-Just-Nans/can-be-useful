from requests import get
from os import mkdir
from os.path import join, dirname, abspath, exists
from json import load

g_path = dirname(abspath(__file__))

try:
    with open(join(g_path, "config.json"), "r") as f:
        config = load(f)
except:
    print("Error: config.json, example :")
    print('''{
    "session": "your-session"-token
}''')
    exit()

for num in range(1, 100):
    cookies = {
        'session': config["session"]
    }
    response = get(
        f"https://france-cybersecurity-challenge.fr/api/v1/challenges/{num}",  cookies=cookies)
    json_response = response.json()
    print(f"Doing {num}")
    if "data" not in json_response:
        continue
    text = ""
    text = text + f"# {json_response['data']['name']}" + "\n\n"
    text = text + f"> {json_response['data']['category']}" + "\n\n"
    text = text + json_response["data"]["description"] + "\n\n\n"
    for one in range(0, len(json_response["data"]["files"])):
        link_to_file = f"https://france-cybersecurity-challenge.fr{json_response['data']['files'][one]}"
        text = text + f"[{link_to_file}]({link_to_file})" + "\n"

    path = join(g_path, "..", f"challenge-{str(num)}")
    if not exists(path):
        mkdir(path)
    f = open(join(path, "README.md"), "w")
    f.write(text)
    f.close()
