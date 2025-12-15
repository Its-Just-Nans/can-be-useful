# video-is-3d

- Inspiration from <https://www.youtube.com/watch?v=NZFxQXe7LMM>

The concept is to run a `modifier()` function on each pixel that returns new pixel coordinates with (x,y,frame_id). The new video can use the `frame_id` to traverse the video in this new third dimension.

Here are some examples:

![input](./examples/input.gif)

> Input video from <https://www.youtube.com/watch?v=tG8wYlIOqbI>

![example x](./examples/test_frame_plus_x.gif)
![example y](./examples/test_frame_plus_y.gif)

## Notes

The current script is not fully optimized. It currently use multiprocessing to speed up the process with shared memory. But currently, the script is memory bound - it loads part of the video into the shared memory and other parts into the local memory of the process.

> Made in 2024-07-14
