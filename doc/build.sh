#!/bin/bash

CWD=$(dirname $(readlink -f $0))

mkdir -p _static

#cd bricks-documentation && cp --parents **/*.html ../_static && cd -
cp --parents bricks-documentation/**/**/*.html _static
cp --parents bricks-documentation/**/**/**/*.css _static
cp --parents bricks-documentation/**/**/**/*.js _static
cp --parents bricks-documentation/**/**/**/**/*.js _static
cp --parents bricks-documentation/**/**/**/*.png _static
cp --parents bricks-documentation/**/**/**/**/*.js _static
cp bricks-documentation/doc-config.js _static/bricks-documentation

echo "--- Cleaning old documentation"

make clean

echo "--- Generating API documentation"

(cd $CWD/developer-guide/api && ./build.sh)

echo "--- Generating HTML documentation"

make html
