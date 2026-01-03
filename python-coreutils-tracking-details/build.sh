#!/bin/bash

#!/usr/bin/env bash
set -euo pipefail

# Function to download latest artifact from a GitHub Actions workflow
download_latest_artifact() {
    local workflow="$1"        # e.g. GnuTests.yml
    local artifact_name="$2"   # e.g. test-logs
    local repo="$3"            # e.g. uutils/coreutils
    local max_runs="${4:-20}"  # optional, default to 20
    local out="${5:-$artifact_name.json}" # optional output filename
    
    local owner
    owner=$(echo "$repo" | cut -d/ -f1)
    local name
    name=$(echo "$repo" | cut -d/ -f2)
    
    local api="https://api.github.com"
    
    echo "Searching last $max_runs runs of $workflow in $repo for artifact '$artifact_name'..."
    
    # 1. Fetch latest workflow runs
    local run_ids
    run_ids=$(curl -s -H "Accept: application/vnd.github+json" \
        "$api/repos/$owner/$name/actions/workflows/$workflow/runs?per_page=$max_runs" \
    | jq -r '.workflow_runs[].id')
    
    if [[ -z "$run_ids" ]]; then
        echo "No workflow runs found for $workflow"
        return 1
    fi
    
    # 2. Iterate runs and find artifact
    for run_id in $run_ids; do
        echo "Checking run $run_id..."
        
        local artifact_url
        artifact_url=$(curl -s -H "Accept: application/vnd.github+json" \
            "$api/repos/$owner/$name/actions/runs/$run_id/artifacts" \
            | jq -r --arg NAME "$artifact_name" \
            '.artifacts[]? | select(.name==$NAME) | .archive_download_url' \
        | head -n 1)
        
        if [[ -n "$artifact_url" && "$artifact_url" != "null" ]]; then
            echo "Found artifact '$artifact_name' in run $run_id"
            echo "Downloading to '$out'..."
            curl -L -o "$out" "$artifact_url"
            echo "Saved '$out'"
            return 0
        fi
    done
    
    echo "Artifact '$artifact_name' not found in last $max_runs runs of $workflow"
    return 1
}


# this will NOT WORK - it requires auth

# Download test-logs artifact
download_latest_artifact "GnuTests.yml" "test-logs" "uutils/coreutils"

# Download gnu-full-result artifact
download_latest_artifact "GnuTests.yml" "gnu-full-result" "uutils/coreutils"

python builder.py

