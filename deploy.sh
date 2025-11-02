#!/bin/bash

# Deploy script for Dr. Sheela's Clinic React App
# This script builds the React app and uploads it to S3 bucket: drsheelasclinic

set -e  # Exit on any error

# Configuration
S3_BUCKET="drsheelasclinic"
AWS_REGION="us-west-2"
CLOUDFRONT_DISTRIBUTION_ID="E2PLUVBGMZ4ZYL"  # From README.md

echo "🏥 Dr. Sheela's Clinic - React App Deployment"
echo "=============================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "   Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

echo "✅ npm is available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Build the React app
echo "🔨 Building React app..."
npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if S3 bucket exists and is accessible
echo "🔍 Checking S3 bucket access..."
if ! aws s3 ls "s3://$S3_BUCKET" &> /dev/null; then
    echo "❌ Cannot access S3 bucket: $S3_BUCKET"
    echo "   Please check your AWS credentials and bucket permissions"
    exit 1
fi

echo "✅ S3 bucket is accessible"

# Upload files to S3
echo "📤 Uploading files to S3..."
aws s3 sync build/ "s3://$S3_BUCKET" --delete --region "$AWS_REGION"

if [ $? -eq 0 ]; then
    echo "✅ Files uploaded successfully to S3"
else
    echo "❌ Failed to upload files to S3"
    exit 1
fi

# Invalidate CloudFront cache
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --paths "/*" \
        --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        echo "✅ CloudFront cache invalidation initiated"
    else
        echo "⚠️  CloudFront invalidation failed, but deployment was successful"
        echo "   You may need to manually invalidate the cache"
    fi
else
    echo "⚠️  CloudFront Distribution ID not set - skipping cache invalidation"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "🌐 Website URL: http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
echo "📊 CloudFront URL: https://d2example.cloudfront.net (if configured)"
echo ""
echo "📝 Deployment Summary:"
echo "   - S3 Bucket: $S3_BUCKET"
echo "   - Region: $AWS_REGION"
echo "   - Build Directory: ./build"
echo "   - Files Synced: All files from build directory"
echo "   - Cache Invalidation: CloudFront distribution $CLOUDFRONT_DISTRIBUTION_ID"
echo ""
echo "💡 Note: It may take a few minutes for changes to be visible due to CDN caching."

