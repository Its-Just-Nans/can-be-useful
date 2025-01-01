import requests
import bs4
from json import dumps
from multiprocessing import Pool


req = requests.get("https://sid.ethz.ch/fonts/")

soup = bs4.BeautifulSoup(req.text, "html.parser")


def process_url(url):
    arr = []
    try:
        url = "https://sid.ethz.ch/fonts/" + url[1:]
        print(url)
        font = requests.get(url)
        all_links = bs4.BeautifulSoup(font.text, "html.parser").find_all("a")
        for one_link in all_links:
            one_link = one_link.get("href")
            if one_link.endswith(".ttf"):
                full_url = url + "/" + one_link
                print(full_url)
                arr.append(full_url)
        return arr
    except Exception as e:
        print(e)


def multi_process_requests(urls):
    # Define the number of processes you want to run concurrently
    num_processes = 10  # You can adjust this according to your system's capacity

    with Pool(processes=num_processes) as pool:
        results = pool.map(process_url, urls)

    return results


def flatten_concatenation(matrix):
    flat_list = []
    for row in matrix:
        flat_list += row
    return flat_list


urls = [a.get("href") for a in soup.find_all("a")]
print(urls)
results = multi_process_requests(urls)

results = flatten_concatenation(results)

with open("src/fonts.js", "w") as f:
    f.write("export default " + dumps(results, indent=4))
