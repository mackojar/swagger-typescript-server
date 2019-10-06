#!/bin/bash
set -e

SWFILE=${1:-swagger/swagger.yaml}

echo "Remove swagger generator destination folder..."
rm -rf tsang/model/*

echo "Generate model from $SWFILE..."
java -jar swagger/swagger-codegen-cli.jar generate -l typescript-angular -o tsang -i $SWFILE

echo "Remove application model folder..."
rm -rf app/src/model/*

echo "Copying generated model to application folder..."
cp -r tsang/model app/src
