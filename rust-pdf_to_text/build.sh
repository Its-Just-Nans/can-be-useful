#!/bin/bash

curl -L -o trunk-x86_64-unknown-linux-gnu.tar.gz \
https://github.com/trunk-rs/trunk/releases/latest/download/trunk-x86_64-unknown-linux-gnu.tar.gz

tar -xzf trunk-x86_64-unknown-linux-gnu.tar.gz
chmod +x trunk

./trunk build --release --public-url ./
