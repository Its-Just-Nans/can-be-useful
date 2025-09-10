#!/bin/bash

rm -rf dist/
mkdir -p dist/
cp -R html-* dist/
cp -R cdn dist/

python -m pip install -U indexage
cd dist/ || exit 1
python -m indexage . --skip-exists --link https://github.com/Its-Just-Nans/can-be-useful/tree/main/
cd ..|| exit 1