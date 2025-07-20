#!/bin/bash
# Script to deploy a Lambda function by name
# Usage: ./deploy_lambda.sh <LambdaFunctionName>
# Assumes the code for the Lambda is in a folder named after the function in the parent directory

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <LambdaFunctionName>"
  exit 1
fi

LAMBDA_NAME="$1"
LAMBDA_DIR="../$LAMBDA_NAME"
ZIP_FILE="${LAMBDA_NAME}.zip"

if [ ! -d "$LAMBDA_DIR" ]; then
  echo "Directory $LAMBDA_DIR does not exist."
  exit 1
fi

# Zip the contents of the Lambda directory
cd "$LAMBDA_DIR"
zip -r "../scripts/$ZIP_FILE" .
cd - > /dev/null

# Update the Lambda function code
aws lambda update-function-code --function-name "$LAMBDA_NAME" --zip-file "fileb://scripts/$ZIP_FILE"

# Remove the zip file after deployment
rm "scripts/$ZIP_FILE"

echo "$LAMBDA_NAME deployed successfully." 