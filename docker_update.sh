#!/bin/bash

cd /src
git pull
npm install

forever stopall
forever /src/app.js
forever list