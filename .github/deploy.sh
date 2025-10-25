#!/bin/bash

rm -rf dist/
mkdir -p dist/
cp -R html-* dist/
cp -R js-onclick-interceptor dist/
cp -R cdn dist/

projects=("svelte-bad-font-viewer" "svelte-cv-creator" "js-readme-compiler")

output_folders=("dist" "public")

# Loop through each element in the array
for project in "${projects[@]}"; do
    echo "building $project"
    pushd "$project" || exit 1
    npm install --force
    npm run build
    for output_folder in "${output_folders[@]}"; do
        if [ -e "$output_folder" ]; then
            cp -R "$output_folder/" "../dist/$project"
        fi
    done
    popd || exit 1
done

python -m pip install -U indexage
cd dist/ || exit 1
python -m indexage . --skip-exists --link https://github.com/Its-Just-Nans/can-be-useful/tree/main/
cd ..|| exit 1