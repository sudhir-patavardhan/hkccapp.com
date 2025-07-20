#!/bin/bash
# Script to download and extract all AWS Lambda function code into the lambda/ folder
# Requires AWS CLI and unzip installed and configured

set -e

LAMBDA_DIR="$(dirname "$0")"
cd "$LAMBDA_DIR"

# List all Lambda function names
FUNCTIONS=$(aws lambda list-functions --query 'Functions[*].FunctionName' --output text)

for FUNCTION in $FUNCTIONS; do
    echo "Processing $FUNCTION..."
    # Get the code location URL
    URL=$(aws lambda get-function --function-name "$FUNCTION" --query 'Code.Location' --output text)
    ZIP_FILE="${FUNCTION}.zip"
    DEST_DIR="$FUNCTION"

    # Download the zip file
    curl -sSL "$URL" -o "$ZIP_FILE"

    # Create destination directory
    mkdir -p "$DEST_DIR"

    # Unzip the code
    unzip -o "$ZIP_FILE" -d "$DEST_DIR"

    # Remove the zip file
    rm "$ZIP_FILE"
    echo "$FUNCTION downloaded and extracted."
done

echo "All Lambda functions have been downloaded and extracted into the lambda/ folder." 