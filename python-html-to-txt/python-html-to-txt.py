"""HTML to txt"""

import os
import sys
from urllib.parse import urljoin, urlparse
import html2text
import requests
from bs4 import BeautifulSoup

visited = set()
domain = ""


def sanitize_filename(url_path):
    return url_path.strip("/").replace("/", "_") or "index"


def fetch_and_convert(url):
    try:
        res = requests.get(url, timeout=10)
        if "text/html" not in res.headers.get("Content-Type", ""):
            return None, None
        soup = BeautifulSoup(res.text, "html.parser")
        for tag in soup(["script", "style"]):
            tag.decompose()
        html = str(soup.body or soup)
        markdown = html2text.html2text(html)
        return markdown, soup
    except Exception as e:
        print(f"[!] Failed to fetch {url}: {e}")
        return None, None


def crawl(url, base_url):
    if url in visited or not url.startswith(domain):
        return
    visited.add(url)
    print(f"[+] Crawling: {url}")

    markdown, soup = fetch_and_convert(url)
    if markdown is None:
        return

    # Save markdown
    parsed = urlparse(url)
    filename = sanitize_filename(parsed.path) + ".md"
    os.makedirs("output", exist_ok=True)
    with open(os.path.join("output", filename), "w", encoding="utf-8") as f:
        f.write(markdown)

    # Find and crawl internal links
    for link in soup.find_all("a", href=True):
        next_url = urljoin(url, link["href"])
        if domain in next_url and next_url not in visited:
            crawl(next_url, base_url)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python crawl_to_md.py https://example.com")
        sys.exit(1)

    start_url = sys.argv[1]
    domain = urlparse(start_url).scheme + "://" + urlparse(start_url).netloc
    crawl(start_url, domain)
    print("[✓] Done.")
