# python

```sh
# rename leading zeros
for a in [0-9]*.png; do mv $a `printf %04d.%s ${a%.*} ${a##*.}`; done
# convert to video
ffmpeg -framerate 10 -y -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p -vf scale=720:-1 out.mp4
# play video
ffplay out.mp4
# convert to gif
fmpeg -i out.mp4 -vf "fps=10,scale=720:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif
```
