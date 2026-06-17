# python-video-yolov8

## Usage

```sh
mkdir -p frames
# extract_frames video
ffmpeg -i input.mp4 -q:v 2 frames/frame_%06d.jpg

# move the frame you want to edit to the current
# the program will edit and save them in the frames/ folder
mv frame_000001.jpg .
ls *.jpg | python detection.py --out-dir frames --save-json --black

# reassemble video (change FPS if needed)
# to get fps
# ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of csv=p=0 input.mp4
FPS=24
ffmpeg -framerate "$FPS" -i frames/frame_%06d.jpg -c:v libx264 -pix_fmt yuv420p output.mp4

# if you want to add the sound
ffmpeg -i output.mp4 -i input.mp4 -c:v copy -map 0:v:0 -map 1:a:0 -shortest output_with_audio.mp4
```
