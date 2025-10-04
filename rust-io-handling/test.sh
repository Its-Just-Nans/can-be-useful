#!/bin/bash

while true; do
    echo "toto stdout"         # prints to stdout
    echo "toto stderr" >&2      # prints to stderr
    sleep 5
done