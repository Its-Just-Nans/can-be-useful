#!/bin/bash


if [ ! -f "data.json" ];then
    if [ ! -d "typst" ]; then
        git clone https://github.com/typst/typst.git
    fi
    cd typst/docs || exit 1
    cargo run -- --out-file data.json
    cp data.json ../..
    cd ../..
fi

# create index
node index.js

# deployement stuff
curl "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/flexsearch.light.module.min.js" > flexsearch.light.module.min.js

rm -rf dist/
mkdir -p dist/
cp index.html dist/
cp index.json dist/
cp flexsearch.light.module.min.js dist/