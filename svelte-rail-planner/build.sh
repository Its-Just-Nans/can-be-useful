#!/bin/sh

python get_data.py download
npm install --force
npm run build