#!/usr/bin/env bash
git pull origin master
npm i
npm run build
sudo service nginx restart
