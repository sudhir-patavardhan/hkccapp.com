#!/bin/bash

# Advanced Deploy script for Dr. Sheela's Clinic React App
# Features: Backup, rollback, staging environment support

set -e

# Configuration
S3_BUCKET="drsheelasclinic"
AWS_REGION="us-west-2"
CLOUDFRONT_DISTRIBUTION_ID="E2PLUVBGMZ4ZYL"
BACKUP_BUCKET="${S3_BUCKET}-backup"  # Optional backup bucket
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --dry-run        Show what would be deployed without actually deploying"
    echo "  --backup         Create backup before deployment"
    echo "  --rollback       Rollback to previous deployment"
    echo "  --staging        Deploy to staging environment"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy to production"
    echo "  $0 --dry-run          # Preview deployment"
    echo "  $0 --backup           # Deploy with backup"
    echo "  $0 --staging          # Deploy to staging"
}

# Parse command line arguments
DRY_RUN=false
CREATE_BACKUP=false
ROLLBACK=false
STAGING=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --backup)
            CREATE_BACKUP=true
            shift
            ;;
        --rollback)
            ROLLBACK=true
            shift
            ;;
        --staging)
            STAGING=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Adjust configuration for staging
if [ "$STAGING" = true ]; then
    S3_BUCKET="${S3_BUCKET}-staging"
    log_info "Using staging environment: $S3_BUCKET"
fi

echo "🏥 Dr. Sheela's Clinic - Advanced React App Deployment"
echo "======================================================"

# Pre-flight checks
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS CLI is not configured"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Create backup function
create_backup() {
    log_info "Creating backup..."
    
    # Create timestamped backup in S3
    aws s3 sync "s3://$S3_BUCKET" "s3://$BACKUP_BUCKET/backups/$TIMESTAMP" --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        log_success "Backup created: s3://$BACKUP_BUCKET/backups/$TIMESTAMP"
    else
        log_warning "Backup creation failed, but continuing with deployment"
    fi
}

# Rollback function
rollback() {
    log_info "Rolling back to previous deployment..."
    
    # List available backups
    log_info "Available backups:"
    aws s3 ls "s3://$BACKUP_BUCKET/backups/" --region "$AWS_REGION"
    
    # Get the most recent backup
    LATEST_BACKUP=$(aws s3 ls "s3://$BACKUP_BUCKET/backups/" --region "$AWS_REGION" | sort | tail -n 1 | awk '{print $2}')
    
    if [ -z "$LATEST_BACKUP" ]; then
        log_error "No backups found"
        exit 1
    fi
    
    log_info "Rolling back to: $LATEST_BACKUP"
    
    # Restore from backup
    aws s3 sync "s3://$BACKUP_BUCKET/backups/$LATEST_BACKUP" "s3://$S3_BUCKET" --delete --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        log_success "Rollback completed successfully"
        # Invalidate CloudFront
        aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" --region "$AWS_REGION"
    else
        log_error "Rollback failed"
        exit 1
    fi
}

# Build application
build_app() {
    log_info "Building React application..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm install
    fi
    
    # Build the app
    npm run build
    
    if [ ! -d "build" ]; then
        log_error "Build failed - build directory not found"
        exit 1
    fi
    
    log_success "Build completed successfully"
}

# Deploy to S3
deploy_to_s3() {
    log_info "Deploying to S3..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "DRY RUN - Files that would be uploaded:"
        aws s3 sync build/ "s3://$S3_BUCKET" --delete --region "$AWS_REGION" --dryrun
        return 0
    fi
    
    # Check bucket access
    if ! aws s3 ls "s3://$S3_BUCKET" &> /dev/null; then
        log_error "Cannot access S3 bucket: $S3_BUCKET"
        exit 1
    fi
    
    # Upload files
    aws s3 sync build/ "s3://$S3_BUCKET" --delete --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        log_success "Files uploaded successfully to S3"
    else
        log_error "Failed to upload files to S3"
        exit 1
    fi
}

# Invalidate CloudFront
invalidate_cloudfront() {
    if [ "$DRY_RUN" = true ]; then
        log_info "DRY RUN - Would invalidate CloudFront cache"
        return 0
    fi
    
    if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        log_info "Invalidating CloudFront cache..."
        aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" --region "$AWS_REGION"
        
        if [ $? -eq 0 ]; then
            log_success "CloudFront cache invalidation initiated"
        else
            log_warning "CloudFront invalidation failed"
        fi
    fi
}

# Main deployment flow
main() {
    check_prerequisites
    
    if [ "$ROLLBACK" = true ]; then
        rollback
        exit 0
    fi
    
    if [ "$CREATE_BACKUP" = true ]; then
        create_backup
    fi
    
    build_app
    deploy_to_s3
    invalidate_cloudfront
    
    echo ""
    log_success "Deployment completed successfully!"
    echo "🌐 Website URL: http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
    echo "📊 Timestamp: $TIMESTAMP"
    
    if [ "$DRY_RUN" = false ]; then
        echo "💡 Note: Changes may take a few minutes to be visible due to CDN caching."
    fi
}

# Run main function
main

