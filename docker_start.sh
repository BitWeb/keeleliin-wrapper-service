#!/bin/bash

cp -R -u -p /src/config_dist.js /config/config.js

if [ -f /config/config.js ]; then
    cp /config/config.js /src/config.js
fi

if [ ! -f /src/config.js ]; then
    cp -R -u -p /src/config_dist.js /src/config.js
fi

forever /src/app.js