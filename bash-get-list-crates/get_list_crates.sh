#!/bin/bash

# Usage: ./get_user_crates.sh <username>

USERNAME="$1"
me="Its-Just-Nans"

if [ -z "$USERNAME" ]; then
    echo "Usage: $0 <crates.io username>"
    echo "Defaulting to '$me'"
    USERNAME="$me"
fi

USER_AGENT="get all crates scripts"

PAGE=1
PER_PAGE=100
ALL_CRATES=()

user_id=$(curl -s "https://crates.io/api/v1/users/$USERNAME" -H "User-Agent: $USER_AGENT" | jq -r '.user.id')

if [ -z "$user_id" ] || [ "$user_id" == "null" ]; then
    echo "User '$USERNAME' not found on crates.io."
    exit 1
fi

echo "Fetching crates for user '$USERNAME' (ID: $user_id)..."

while : ; do
    sleep 1  # To avoid hitting the API too fast
    RESPONSE=$(curl -s "https://crates.io/api/v1/crates?user_id=$user_id&page=$PAGE&per_page=$PER_PAGE" -H "User-Agent: $USER_AGENT")

    # Check if the response contains crates
    CRATES=$(echo "$RESPONSE" | jq -r '.crates[].id')
    if [ -z "$CRATES" ]; then
        break
    fi

    # Append to the list
    while IFS= read -r crate; do
        ALL_CRATES+=("$crate")
    done <<< "$CRATES"

    # If less than requested, it's the last page
    COUNT=$(echo "$CRATES" | wc -l)
    if [ "$COUNT" -lt "$PER_PAGE" ]; then
        break
    fi

    ((PAGE++))
done

# Print results
echo "Crates published by user '$USERNAME':"
# crate a json to list.json
echo "[" > list.json
for i in "${!ALL_CRATES[@]}"; do
    echo "  \"${ALL_CRATES[$i]}\"$(if [ "$i" -lt $((${#ALL_CRATES[@]} - 1)) ]; then echo ","; fi)"
done >> list.json
echo "]" >> list.json
echo "Total crates found: ${#ALL_CRATES[@]}"
echo "Crates list saved to list.json"


{
echo "# crates"
echo ""
echo "- <https://crates.io/users/$USERNAME>"
echo -e "\n## Crates\n"
echo "| Crate | Description | Homepage && Repo |"
echo "|-------|------------|----------|"
}> README.md
for crate in "${ALL_CRATES[@]}"; do
    sleep 0.5  # To avoid hitting the API too fast
    CRATE_INFO=$(curl -s "https://crates.io/api/v1/crates/$crate" -H "User-Agent: $USER_AGENT")
    REPO_URL=$(echo "$CRATE_INFO" | jq -r '.crate.repository')
    HOMEPAGE_URL=$(echo "$CRATE_INFO" | jq -r '.crate.homepage')
    DOC_URL=$(echo "$CRATE_INFO" | jq -r '.crate.documentation')
    DESCRIPTION=$(echo "$CRATE_INFO" | jq -r '.crate.description')
    echo -n "| [$crate](https://crates.io/crates/$crate) |"
    if [ "$DESCRIPTION" != "null" ]; then
        echo -n "$DESCRIPTION"
    else
        echo -n " N/A"
    fi
    echo -n " | "
    if [ "$HOMEPAGE_URL" != "null" ]; then
        echo -n "[$HOMEPAGE_URL]($HOMEPAGE_URL) "
    else
        echo -n " N/A "
    fi
    if [ "$REPO_URL" != "null" ]; then
        echo -n "<br/> [$REPO_URL]($REPO_URL)"
    else
        echo -n "<br/> N/A"
    fi
    if [ "$DOC_URL" != "null" ]; then
        echo -n "<br/> [$DOC_URL]($DOC_URL)"
    else
        echo -n "<br/> N/A"
    fi
    echo -n " |"
    echo ""
done >> README.md