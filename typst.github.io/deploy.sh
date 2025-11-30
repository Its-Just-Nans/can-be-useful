#!/bin/bash

set -x

if [ ! -d "typst" ]; then
    echo "Typst directory does not exist. Cloning repository..."
    git clone https://github.com/typst/typst.git
fi
if [ ! -d "typst/assets" ]; then
    cd typst || exit 1
    cargo run --package typst-docs -- --assets-dir assets/docs --out-file assets/docs.json --base /en/
    cd ..
fi


if [ ! -d "typst-jp.github.io" ]; then
    echo "Website directory does not exist. Cloning repository..."
    git clone https://github.com/typst-jp/typst-jp.github.io.git
fi
if [ ! -d "typst-jp.github.io/assets" ]; then
    cd typst-jp.github.io || exit 1
    cargo run --package typst-docs -- --assets-dir assets/docs --out-file assets/docs.json --base /jp/
    cd ..
fi

rm -rf dist/
mkdir -p dist/

if [ -d "website_builder" ]; then
    rm -rf website_builder
fi

mkdir -p website_builder
cp -r typst-jp.github.io/website website_builder/
cd website_builder/website || exit 1
npm install
rm -rf public/index.html
# delete the js redirection to /docs
sed -i '29,31d' src/index.tsx
sed -i 's|https://typst-jp.github.io/|https://typst-github-io.n4n5.dev/|g' vite.config.ts
cd ../..

cp -r typst/assets/ website_builder/assets/
cd website_builder/website || exit 1
sed -i '9s|docs/||' package.json
sed -i '9s|dist/|dist/en/|' package.json
sed -i 's|/pagefind/pagefind|/en/pagefind/pagefind|g' src/components/ui/common/SearchWindow.tsx
npm run build
mv dist/ ../../dist/en/
cd ../..
# sleep 20
rm -rf website_builder/assets/
cp -r typst-jp.github.io/assets/ website_builder/assets/
cd website_builder/website || exit 1
sed -i '9s|dist/en/|dist/jp/|' package.json
sed -i 's|/en/pagefind/pagefind|/jp/pagefind/pagefind|g' src/components/ui/common/SearchWindow.tsx
npm run build
mv dist/ ../../dist/jp/
cd ../..
cp index.html dist/
cp -r dist/jp/assets/ dist/assets
mv dist/en/en/* dist/en/
mv dist/en/assets/docs/* dist/en/assets/
mv dist/jp/jp/* dist/jp/
mv dist/jp/assets/docs/* dist/jp/assets/