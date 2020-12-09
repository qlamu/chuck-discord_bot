#!/bin/sh

if [ -n "$1" ]
    then
        echo '{"prefix":"%","token":"'$1'"}' > config.json
fi

node bot.js