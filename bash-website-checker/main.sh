. env.sh

while IFS= read -r line; do
    if curl -Ls $line >/dev/null; then
        # do nothing
        echo $line
    else
        curl -H "Content-Type: application/json" -d "{\"username\": \"checker\", \"content\": \"$line est down\"}" $URL
    fi
done <list.txt
