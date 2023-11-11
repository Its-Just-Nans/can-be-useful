#!/bin/bash

for f in $(ls -1 *.MP4); do
    f_date=$(ls -l --time-style=long-iso ${f} | awk '{ print $6}')
    base=${f/.MP4/}
    ffmpeg.exe -i ${f} -preset veryslow ${f_date}_${base}.mp4
    touch -r ${f} ${f_date}_${base}.mp4
done
