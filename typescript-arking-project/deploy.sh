#!/bin/bash

git pull && npm install && npm run build && systemctl restart server.service
