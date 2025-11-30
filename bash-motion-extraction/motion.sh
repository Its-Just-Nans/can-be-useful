#!/bin/bash

# check $1
if [ -z "$1" ]; then
    echo "Usage: $0 <input_file>"
    echo "Default extension is 'mp4'."
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "Input file $1 does not exist."
    exit 1
else
    echo "Input file: $input_file"
fi

input="${1%.*}"
extension="${1##*.}"
input_file="$input.$extension"

if [ ! -f "$input_file" ]; then
    echo "Wrong input file parsing: $1 does not equal $input_file"
    exit 1
fi


force="-y"
opacity="0.5"
seconds="1"

seconds="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input_file" | awk '{printf "%d\n", $1}')"
if [ -z "$seconds" ]; then
    echo "Could not retrieve video duration."
    exit 1
fi
echo "Video duration: $seconds seconds"
final_output="${input}_output.mp4"
ffmpeg -hide_banner -i "$input_file" -i "$input_file" -filter_complex "[1:v]negate,setpts=PTS+${seconds}/TB,format=rgba,colorchannelmixer=aa=${opacity}[ol];[0:v][ol]overlay=0:0" "$final_output" "$force"

ffplay "$final_output" -autoexit