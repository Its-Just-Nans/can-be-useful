"""
https://github.com/Its-Just-Nans/video-is-3d

"""

from multiprocessing import Pool
import cv2
import os
import numpy as np
import logging
from tqdm import tqdm
from pathlib import Path
from multiprocessing import shared_memory
import math


def extract_imgs(folder, video):
    if not os.path.exists(folder):
        os.makedirs(folder)
    cap = cv2.VideoCapture(video)
    count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imwrite(f"{folder}/frame_{count:04d}.jpg", frame)
        count += 1
    cap.release()

    print(f"{count} images extracted and saved in the folder images")


def multi_process(my_func, my_args, num_processes):
    """https://golb.n4n5.dev/python"""
    results = []

    with Pool(processes=num_processes) as pool:
        for result in pool.imap(my_func, my_args):
            results.append(result)

    return results


class FrameReader:
    imgs = None
    folder = ""
    height = 0
    width = 0
    buff_size = 0
    last_inserted = []
    not_shared = {}

    def __init__(self, folder, height, width, buff_size, mem_name=None):
        self.folder = folder
        self.height = height
        self.width = width
        self.buff_size = buff_size
        self.existing_shm = shared_memory.SharedMemory(name=mem_name)
        self.imgs = np.ndarray(
            (buff_size, height, width, 3), dtype=np.uint8, buffer=self.existing_shm.buf
        )
        self.black_frame = np.zeros((height, width, 3), np.uint8)

    def self_clean(self, ignore):
        while len(self.imgs) > self.buff_size:
            key = self.last_inserted.pop(0)
            if key == ignore:
                logging.debug(f"Skipping {key}")
                self.last_inserted.append(key)
                key = self.last_inserted.pop(0)
            logging.debug(f"Deleting {key}")
            del self.imgs[key]
        logging.debug(f"Buffer size: {len(self.imgs)}, {self.last_inserted}")

    def get(self, i):
        if i < -1:
            return self.black_frame
        if i not in self.last_inserted:
            if i == -1:
                return self.black_frame
            else:
                img_path = os.path.join(self.folder, f"frame_{i:04d}.jpg")
                if not os.path.exists(img_path):
                    return self.black_frame
                if i >= len(self.imgs):
                    if i in self.not_shared:
                        return self.not_shared[i]
                    logging.debug(
                        f"Reading not shared{img_path}, {i}, {len(self.imgs)}"
                    )
                    self.not_shared[i] = cv2.imread(img_path)
                    return self.not_shared[i]
                logging.debug(f"Reading {img_path}, {i}, {len(self.imgs)}")
                self.imgs[i] = cv2.imread(img_path)
                self.last_inserted.append(i)
            self.self_clean(i)
        return self.imgs[i]


def run_func_on_imgs(in_folder, output_folder, num_workers):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    imgs = os.listdir(in_folder)
    total_imgs = len(imgs)
    img = cv2.imread(os.path.join(in_folder, "frame_0000.jpg"))
    h, w, _ = img.shape
    size = total_imgs * w * h * 3
    size_gb = size / 1024 / 1024 / 1024
    try:
        shm = shared_memory.SharedMemory(create=True, size=size)
        print(f"Shared memory created: {shm.name}, size: {size_gb}GB")

        # create slice of imgs
        logging.debug("Starting processing")
        if num_workers == 1:
            args = [
                (in_folder, output_folder, i, 1, total_imgs, h, w, shm.name)
                for i in range(0, total_imgs)
            ]
            for arg in tqdm(args):
                proccess_imgs(arg)
        else:
            slice_size = total_imgs // num_workers + 1
            args = [
                (in_folder, output_folder, i, slice_size, total_imgs, h, w, shm.name)
                for i in range(0, total_imgs, slice_size)
            ]
            multi_process(proccess_imgs, args, num_workers)
    except KeyboardInterrupt:
        pass
    finally:
        shm.close()
        shm.unlink()


def proccess_imgs(arguments):
    in_folder, output_folder, i, slice_size, total, h, w, name = arguments
    reader = FrameReader(in_folder, h, w, buff_size=min(total // 2, 500), mem_name=name)
    end_img = min(i + slice_size, total)
    logging.info(f"Processing slice {i} to {end_img}")
    list_imgs = range(i, end_img)
    for i in list_imgs:
        logging.info(f"Processing frame {i} (end: {end_img}, total: {total})")
        new_frame = np.zeros((h, w, 3), np.uint8)
        for x in range(h):
            for y in range(w):
                new_x, new_y, new_fr = modifier(x, y, i, h - 1, w - 1, total - 1)
                new_x = clamp(0, int(new_x), h - 1)
                new_y = clamp(0, int(new_y), w - 1)
                new_fr = clamp(0, int(new_fr), total - 1)
                new_frame[x, y] = reader.get(new_fr)[new_x, new_y]
        output_img = f"{output_folder}/frame_{i:04d}.jpg"
        cv2.imwrite(output_img, new_frame)
        reader.self_clean(None)
    reader.existing_shm.close()


def build_video(folder, output_video, fps):
    path_first_img = os.path.join(folder, "frame_0000.jpg")
    if not os.path.exists(path_first_img):
        print(f"First image not found: {path_first_img}")
        return
    img = cv2.imread(path_first_img)
    h, w, _ = img.shape
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_video, fourcc, fps, (w, h))
    all_imgs = os.listdir(folder)
    all_imgs.sort()
    for img in tqdm(all_imgs):
        if img.endswith(".jpg"):
            img_path = os.path.join(folder, img)
            frame = cv2.imread(img_path)
            out.write(frame)
    out.release()


def clamp(minv, val, maxv):
    return max(minv, min(val, maxv))


def modifier(x, y, frame, _max_x, _max_y, _max_frame):
    final_x = x
    final_y = y
    final_frame = frame + x + 10 * math.sin(2 * math.pi * 0.12 * x + 1.5 * math.pi)
    return (final_x, final_y, final_frame)


def main():
    num_workers = 4
    input_folder = "images"
    current = Path(__file__).parent.resolve()
    input_video = str(current / "input.mkv")
    if not os.path.exists(input_folder):
        extract_imgs(input_folder, input_video)

    output_folder = str(current / "output")
    # if not os.path.exists(output_folder):
    run_func_on_imgs(input_folder, output_folder, num_workers)
    output_video = str(current / "render.mp4")
    build_video(output_folder, output_video, 60)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    logging.debug("Starting")
    main()
