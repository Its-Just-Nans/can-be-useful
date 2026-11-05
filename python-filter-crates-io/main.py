import os
import json
import csv


dep_name = "zip"
index = "/tmp/crates.io-index/"

def check():
    results = []

    for root, dirs, files in os.walk(index):
        dirs[:] = [d for d in dirs if d != ".git"]

        for file in files:
            if file == "config.json":
                continue

            path = os.path.join(root, file)

            try:
                with open(path, encoding="utf-8") as f:
                    lines = f.readlines()
                    if not lines:
                        continue
                    f = [lines[-1]]
                    for line in f:
                        try:
                            package = json.loads(line)
                        except json.JSONDecodeError:
                            continue

                        for dep in package.get("deps", []):
                            if dep.get("name") == dep_name:
                                name = package["name"]
                                is_yanked = package["yanked"]
                                if is_yanked:
                                    print(f"package {name} is using {dep_name} but is yanked")
                                    continue
                                pub = package["pubtime"]
                                if not pub.startswith("2026"):
                                    print(f"package {name} is using {dep_name} but latest version is old")
                                    continue
                                results.append({
                                    "package": package["name"],
                                    "package_version": package["vers"],
                                    "dependency": dep["name"],
                                    "version_requirement": dep["req"],
                                    "kind": dep.get("kind") or "normal",
                                    "optional": dep.get("optional", False),
                                })
            except (UnicodeDecodeError, OSError):
                continue
    return results

def load():
    with open(f"{dep_name}_dependencies.csv", "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        results = list(reader)
    return results

def write(results):
    results.sort(key=lambda x: (x["package"], x["package_version"]))

    with open(f"{dep_name}_dependencies.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys() if results else [
            "package", "package_version", "dependency",
            "version_requirement", "kind", "optional"
        ])
        writer.writeheader()
        writer.writerows(results)

filename = f"{dep_name}_dependencies.csv"
if os.path.exists(filename):
    results = load()
else:
    results = check()
    write(results)

print(f"Found {len(results)} matching dependency entries.")

for r in results:
    print(
        f'{r["package"]} {r["package_version"]} '
        f'-> {r["dependency"]} {r["version_requirement"]} '
        f'({r["kind"]})'
    )


version_packages = {}

for p in results:
    v = p["version_requirement"]
    if v not in version_packages:
        version_packages[v] = []
    version_packages[v].append(p["package"])

print("\n\nSTATS")
for version, packages in sorted(version_packages.items()):
    lis = ",".join(packages)
    lis = lis[:15] + ".." if len(lis) > 15 else lis
    count = len(packages)
    count = f"**{count}**" if count > 10 else count
    print(f"{version}: {count} packages ({lis})")

total = sum(len(packages) for packages in version_packages.values())
print(f"Total {total}")
