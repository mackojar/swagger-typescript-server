#!/bin/bash
set -e

SWFILE=${1:-swagger/swagger.yaml}
SWG_VERSION=${2:-2}

echo "Remove swagger generator destination folder..."
rm -rf tsang/model/*

echo "Generate model from $SWFILE..."
if [ $SWG_VERSION == '2' ] ; then
  java -jar swagger/swagger-codegen-cli.jar generate -l typescript-angular -o tsang -i $SWFILE
elif [ $SWG_VERSION == '3' ] ; then
  java -jar swagger/swagger-codegen-cli-3.jar generate -l typescript-angular -o tsang -i $SWFILE
fi

echo "Remove application model folder..."
rm -rf app/src/model/*

echo "Copying generated model to application folder..."
cp -r tsang/model app/src
