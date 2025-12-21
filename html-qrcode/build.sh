#!/bin/bash

mkdir -p dist/
cp index.html dist/404.html

curl https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js -o dist/qrcode.min.js
