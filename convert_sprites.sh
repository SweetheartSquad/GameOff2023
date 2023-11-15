#!/bin/bash -e

# replace this with your aseprite install
ASEPRITE="C:\Program Files (x86)\Steam\steamapps\common\Aseprite\Aseprite.exe";

OUTPUT="./src/assets/textures";

FILE=${1:-"*"};

for f in ./asset_src/passenger*.aseprite;
do "$ASEPRITE" $f -b --split-tags --filename-format "{path}/{title}_{tag}.{frame1}.{extension}" --save-as "$OUTPUT/$(basename $f .aseprite).png";
done
# for f in ./src/assets/textures/passenger*.png;
# do "node" --no-experimental-fetch ./optimize-image.js $f;
# done
