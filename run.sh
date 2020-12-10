#!/bin/sh

# This file is used by the Docker to supply
# a token to the bot and start the bot

if [ -n "$1" ]
  then
    echo '{"prefix":"%","token":"'$1'"}' > config.json
fi

npm run start