#!/bin/bash

URL="https://discord.com/api/webhooks/blablabal/blabalba"

# send a message

curl -X POST -H "Content-Type: application/json" -d '{"content":"test"}' $URL

# change a message

MSG_ID=""

curl --request PATCH -H "Content-Type: application/json" -d '{"content":"test"}' "${URL}/messages/${MSG_ID}"

# add avatar

curl -X POST -H "Content-Type: application/json" -d '{"username":"My username", "avatar_url":"https://boo.net/bar.png","content":"Test"}' "$URL"
