#!/usr/bin/bash

createsvg() {
    local margin="$1"
    local d
    local svg
    for d in *.ai; do
        svg=$(echo "$d" | sed 's/.ai/.svg/')
        echo "creating $svg ..."
        # old version: inkscape "$d" -l -o "$svg"
        if [ "$margin" != "" ]; then
            inkscape "$d" --export-area-drawing --export-margin "$margin" "--export-plain-svg=$svg"
        else
            inkscape "$d" --export-area-drawing "--export-plain-svg=$svg"
        fi
    done
}

if [ "$1" != "" ]; then
    cd $1
fi

createsvg "$2"
