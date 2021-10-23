#!/bin/bash

publish=''

if [ "$1" == "pub" ]; then
    publish='--publish'
fi

rm archive.zip


zip -rq archive.zip ./

aws lambda update-function-code --function-name testFunction --zip-file fileb://./archive.zip $publish

if [ "$1" == "pub" ]; then
    echo 'published new version'
fi
