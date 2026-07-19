#!/bin/bash

cargo install trunk --locked
trunk build --release --public-url ./
