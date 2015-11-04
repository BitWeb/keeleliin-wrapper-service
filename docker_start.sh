#!/bin/bash

if [ ! -f /src/config.js ]; then
    cp -R -u -p /src/config_dist.js /src/config.js
fi

forever /src/app.js