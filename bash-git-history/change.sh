#!/bin/bash

datediff() {
    d1=$(date -d "$1" +%s)
    d2=$(date -d "$2" +%s)
    echo $(((d1 - d2) / 86400))
}

END=$(TZ=utc date -d @$(git log -1 --format=%ct) +%F)
START=$(date --date "today" +%F)

touch file.txt
git add *

num=$(datediff "${START}" "${END}")

for i in $(seq $num | tac); do
    DATE=$(date --date "${i} days ago" -R)
    echo "${DATE}"
    echo -n "a" >>file.txt
    git add file.txt
    GIT_AUTHOR_DATE=$DATE GIT_COMMITTER_DATE=$DATE git commit -m "message"
done
