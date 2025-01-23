# har-glb

Extract `.glb` from `.har` to form `.glb`

```sh
python exporter.py HAR_FILE

cd data/
npm install --global @gltf-transform/cli
gltf-transform merge * out.glb --merge-scenes
```

Made in 2024-03-05
