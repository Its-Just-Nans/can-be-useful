"""python-files-extractor"""

import os
from typing import List, Dict
import zipfile
import tarfile


def unzip_file(zip_path: str, extract_to: str) -> None:
    """
    Unzips a zip file into the specified folder.

    Args:
        zip_path: Path to the .zip file.
        extract_to: Destination folder where files will be extracted.
    """
    # Ensure the destination folder exists
    os.makedirs(extract_to, exist_ok=True)

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_to)


def untar_file(tar_path: str, extract_to: str) -> None:
    """
    Extracts a tar archive (.tar, .tar.gz, .tgz, .tar.bz2) into the specified folder.

    Args:
        tar_path: Path to the tar file.
        extract_to: Destination folder where files will be extracted.
    """
    # Ensure the destination folder exists
    os.makedirs(extract_to, exist_ok=True)

    with tarfile.open(tar_path, "r:*") as tar_ref:
        tar_ref.extractall(path=extract_to)


def list_files_scandir(
    folder_path: str, absolute: bool = True, follow_symlinks: bool = False
) -> List[Dict[str, str]]:
    """
    Faster recursive listing using os.scandir, with control over symlinks.
    """
    results: List[Dict[str, str]] = []

    def _walk(dir_path: str):
        if "__MACOSX" in dir_path:
            return
        with os.scandir(dir_path) as it:
            for entry in it:
                try:
                    if entry.is_file(follow_symlinks=follow_symlinks):
                        if entry.path.endswith(".zip"):
                            cleaned = entry.path.removesuffix(".zip")
                            unzip_file(entry.path, cleaned)
                            _walk(cleaned)
                        elif entry.path.endswith(".tar.gz"):
                            cleaned = entry.path.removesuffix(".tar.gz")
                            try:
                                untar_file(entry.path, cleaned)
                            except Exception as e:
                                print(entry.path, e)
                                continue
                            _walk(cleaned)
                        elif entry.path.endswith(".tgz"):
                            cleaned = entry.path.removesuffix(".tgz")
                            try:
                                untar_file(entry.path, cleaned)
                            except Exception as e:
                                print(entry.path, e)
                                continue
                            _walk(cleaned)
                        else:
                            results.append(
                                {
                                    "path": os.path.abspath(entry.path)
                                    if absolute
                                    else entry.path,
                                    "filename": entry.name,
                                }
                            )
                    elif entry.is_dir(follow_symlinks=follow_symlinks):
                        _walk(entry.path)
                except PermissionError:
                    # Skip directories/files we can't access
                    continue

    _walk(folder_path)
    return results


if __name__ == "__main__":
    base_folder = "data"
    res = list_files_scandir(base_folder)
    print(res)
