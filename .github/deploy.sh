#!/bin/bash

rm -rf dist/
mkdir -p dist/
cp -R html-* dist/
cp -R cdn dist/

python -m pip install -U indexage
cd dist/ || exit 1
python -m indexage . --skip-exists
cd ..|| exit 1