#!/bin/bash

if [ ! -d "typst" ]; then
    git clone git@github.com:typst/typst.git
fi
if [ ! -f "data.json" ];then
    cd typst/docs || exit 1
    cargo run -- --out-file data.json
    cp data.json ../..
    cd ../..
fi
node index.js
curl "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/flexsearch.light.module.min.js" > flexsearch.light.module.min.js

rm -rf dist/
mkdir -p dist/
cp index.html dist/
cp index.json dist/
cp flexsearch.light.module.min.js dist/