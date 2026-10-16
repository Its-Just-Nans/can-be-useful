#!/bin/bash

set -u

DELAY=1

for a in {a..z}; do
    for b in {a..z}; do
        for c in {a..z}; do
            crate="${a}${b}${c}"

            status=$(curl -s --max-time 10 \
                -o /dev/null \
                -w "%{http_code}" \
                -A "crate-scanner/1.0 (contact: you@example.com)" \
                --referer "https://example.com/" \
                "https://crates.io/api/v1/crates/$crate")

            if [[ "$status" == "200" ]]; then
                echo "$crate: exists"
            elif [[ "$status" == "404" ]]; then
                echo "$crate: available"
            else
                echo "$crate: error (HTTP $status)"
            fi

            sleep "$DELAY"
        done
    done
done
