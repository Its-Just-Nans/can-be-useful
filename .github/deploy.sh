#!/bin/bash

rm -rf dist/
mkdir -p dist/
cp -R html-* dist/
cp -R js-onclick-interceptor dist/
cp -R cdn dist/


mapfile -t projects < .github/projects.txt


output_folders=("dist" "public")

# Loop through each element in the array
for project in "${projects[@]}"; do
    echo "building $project"
    pushd "$project" || exit 1
    if [ -e "build.sh" ]; then
        ./build.sh
    elif [ -f "package.json" ];then
        npm install --force
        npm run build
    else
        echo "no build or package.json"
        exit 1
    fi
    for output_folder in "${output_folders[@]}"; do
        if [ -e "$output_folder" ]; then
            echo "Copying from '$project/$output_folder' to dist/$project"
            rm -rf "../dist/$project"
            cp -R "$output_folder/" "../dist/$project"
            break
        else
            echo "No output folder '$project/$output_folder' in $project"
        fi
    done
    popd || exit 1
done

python -m pip install -U indexage
cd dist/ || exit 1
python -m indexage . --skip-exists --link https://github.com/Its-Just-Nans/can-be-useful/tree/main/
cd ..|| exit 1