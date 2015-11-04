#!/bin/bash

cd /src
git pull
npm install

if [ -f /config/config.js ]; then
    cp /config/config.js /src/config.js
fi

forever stopall
forever /src/app.js
forever list