# from https://gitlab.com/thibaudlabat/shell-http-api

PORT=12345

command() {
    uname -a
}

httpify() {
    content="$1"
    echo "HTTP/1.1 200 OK"
    echo "Date: Wed, 15 Dec 2021 14:08:09 GMT"
    echo "Server: Apache/2.4.38 (Debian)"
    echo "Vary: Accept-Encoding"
    echo "Content-Length: ${#content}"
    echo "Content-Type: text/html; charset=UTF-8"
    echo "Connection: close"
    echo ""
    echo "$content"
}

echo "Shell HTTP API Listening on :$PORT"
a=0
while [ $a = 0 ]; do
    {
        { httpify "$(command)"; } | nc -l -p "$PORT" 2>&1 >/dev/null
        a="$?"
    }
done

echo "exit"
