#!/bin/bash

mkdir -p texts
texts=$(ls texts/)
if [ -z "$texts" ] ;then
    echo -n "[]" > texts.json
else
    echo "$texts" | jq -R | jq -s -c> texts.json
fi

rm -rf dist/
mkdir -p dist/
rsync -av --exclude 'dist' ./ dist/
