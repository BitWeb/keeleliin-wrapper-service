#!/bin/bash

if [ ! -f /config/config.js ]; then
    cp -R -u -p /src/config_dist.js /config/config.js
fi

if [ ! -f /src/config.js ]; then
    ln -s /config/config.js /src/config.js
fi

if [ ! -f /config/wrapper_configs/global.js ]; then
    mkdir -p /config/wrapper_configs
    ln -s /src/wrapper_configs/global.js /config/wrapper_configs/global.js
fi

forever /src/app.js