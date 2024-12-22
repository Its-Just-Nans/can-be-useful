#!/bin/bash

cd test || exit

list=$(ls -1 test*.c)
for x in $list; do
    file=${x%.*}
    gcc -Wall "${file}.c" ../src/utils.c ../src/unserialize.c -o "${file}.out"
    out_file="${file}_test.json"
    ./$file.out >$out_file
    diff <(jq -S . $out_file) <(jq -S . $file.json) &>/dev/null || echo "fail $out_file"
    rm $out_file "${file}.out"
done
