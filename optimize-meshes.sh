#!/bin/bash -e

for f in ./asset_src/models/*.glb;
do 
INPUT=$f
OUTPUT="./src/assets/models/$(basename $f)"
npx @gltf-transform/cli dedup $OUTPUT $OUTPUT
npx @gltf-transform/cli meshopt $OUTPUT $OUTPUT
npx @gltf-transform/cli prune $OUTPUT $OUTPUT
done
