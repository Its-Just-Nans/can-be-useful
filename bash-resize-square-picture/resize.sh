#!/bin/bash
OUTPUT_DIR="./output"
mkdir -p "$OUTPUT_DIR"

rm resized_*
for img in *jpg; do
    [ -e "$img" ] || continue  # Skip if no files match
    
    filename=$(basename "$img")
    output="$OUTPUT_DIR/$filename"
    
    # Get original width and height
    width=$(identify -format "%w" "$img")
    height=$(identify -format "%h" "$img")
    
    # Determine the size of the square (largest dimension)
    if [ "$width" -gt "$height" ]; then
        size=$width
    else
        size=$height
    fi
    
    # Pad the image to make it square, centered, with white background
    convert "$img" -background white -gravity center -extent "${size}x${size}" "$output"
done