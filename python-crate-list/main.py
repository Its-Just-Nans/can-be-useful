"""main"""

import time
from urllib.parse import urlparse
import requests

BASE_URL = "https://crates.io/api/v1/crates"
PER_PAGE = 50
TOTAL_CRATES = 500


def extract_github_repo(repo_url):
    """
    Extracts 'owner/repo' from a GitHub URL.
    Example:
    https://github.com/rust-lang/hashbrown
    -> rust-lang/hashbrown
    """
    if not repo_url:
        return None

    parsed = urlparse(repo_url)
    if "github.com" not in parsed.netloc:
        return None

    parts = parsed.path.strip("/").split("/")
    if len(parts) >= 2:
        repo = parts[1].removesuffix(".git")
        return f"{parts[0]}/{repo}"
    return None

def get_version_color(version: str) -> str:
    default_color = "yellow"
    try:
        major = int(version.split('.')[0])
    except (ValueError, IndexError):
        return default_color

    colors = {
        0: "orange",
        1: "blue",
        2: "green",
        3: "red",
        4: "purple",
        5: "pink",
        6: "cyan",
        7: "magenta",
        8: "teal",
        9: "brown",
    }

    return colors.get(major, default_color)

def fetch_crates():
    """fetch crates"""
    crates = []
    pages = TOTAL_CRATES // PER_PAGE

    for page in range(1, pages + 1):
        print(f"Fetching page {page}...")
        response = requests.get(
            BASE_URL,
            params={"page": page, "per_page": PER_PAGE, "sort": "recent-downloads"},
            timeout=5,
            headers={"user-agent": "downloader"},
        )

        if response.status_code != 200:
            print("Error:", response.status_code)
            break

        data = response.json()
        crates.extend(data.get("crates", []))

        # be polite to API
        time.sleep(1)

    return crates[:TOTAL_CRATES]


def generate_html(crates):
    """generate html"""
    html_lines = ["<html><body>"]

    html_lines.append("<h1>Most downloaded crates</h1>")
    html_lines.append("<table>")
    html_lines.append("<tbody>")
    for crate in crates:
        repo_url = crate.get("repository")
        crate_name = crate.get("name")
        crate_version = crate.get("default_version")
        github_repo = extract_github_repo(repo_url)
        version_color = get_version_color(crate_version)

        if github_repo:
            badge_url = f"https://img.shields.io/github/stars/{github_repo}"
        else:
            badge_version_url = ""
        badge_version_url = f"https://img.shields.io/crates/v/{crate_name}"
        
        html_lines.append(f"""
            <tr>
                <td>
                    <a href="https://crates.io/crates/{crate_name}">{crate_name}</a>
                </td>
                <td>
                    <a href="{repo_url}">{repo_url}</a>
                </td>
                <td style="background-color: {version_color}">{crate_version}<td/>
                <td>
                    <img src="{badge_url}" />
                </td>
                <td>
                    <img src="{badge_version_url}" />
            </li>
        """)
    html_lines.append("</tbody>")
    html_lines.append("</table>")
    html_lines.append("</body></html>")

    with open("index.html", "w", encoding="utf-8") as f:
        f.write("\n".join(html_lines))

    print("Saved to index.html")


def main():
    """main"""
    crates = fetch_crates()
    generate_html(crates)


if __name__ == "__main__":
    main()
