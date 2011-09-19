#!/bin/sh

for stim in *.GIF
do
    convert $stim -crop 65x65+128+68 +repage $stim
done
