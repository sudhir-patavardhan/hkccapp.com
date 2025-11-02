# Deployment Guide - Dr. Sheela's Clinic React App

This guide covers how to deploy the React application to AWS S3 and CloudFront.

## 🏗️ Infrastructure

- **S3 Bucket**: `drsheelasclinic`
- **AWS Region**: `us-west-2` (Oregon)
- **Website URL**: http://drsheelasclinic.s3-website-us-west-2.amazonaws.com
- **CloudFront Distribution**: `E2PLUVBGMZ4ZYL`
- **ARN**: `arn:aws:s3:::drsheelasclinic`

## 📋 Prerequisites

1. **AWS CLI** installed and configured
2. **Node.js** and **npm** installed
3. **AWS credentials** with permissions for:
   - S3 bucket access (`drsheelasclinic`)
   - CloudFront invalidation

### AWS CLI Setup
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region (us-west-2)
```

## 🚀 Deployment Options

### Option 1: Simple Deployment
```bash
npm run deploy
# or
./deploy.sh
```

### Option 2: Advanced Deployment with Options
```bash
# Basic deployment
npm run deploy:advanced

# Dry run (preview what would be deployed)
npm run deploy:dry-run

# Deploy with backup
npm run deploy:backup

# Deploy to staging environment
npm run deploy:staging

# Rollback to previous deployment
npm run rollback
```

### Option 3: Manual Deployment
```bash
# Build the app
npm run build

# Upload to S3
aws s3 sync build/ s3://drsheelasclinic --delete --region us-west-2

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E2PLUVBGMZ4ZYL --paths "/*" --region us-west-2
```

## 📁 Deployment Scripts

### `deploy.sh` - Simple Deployment Script
- Builds the React app
- Uploads to S3 with `--delete` flag (removes old files)
- Invalidates CloudFront cache
- Basic error handling

### `deploy-advanced.sh` - Advanced Deployment Script
Features:
- **Dry Run**: Preview deployment without making changes
- **Backup**: Create timestamped backups before deployment
- **Rollback**: Restore from previous backup
- **Staging**: Deploy to staging environment
- **Colored Output**: Better visibility of deployment status
- **Comprehensive Error Handling**

#### Advanced Script Options:
```bash
./deploy-advanced.sh --help              # Show help
./deploy-advanced.sh --dry-run           # Preview deployment
./deploy-advanced.sh --backup            # Deploy with backup
./deploy-advanced.sh --rollback          # Rollback to previous
./deploy-advanced.sh --staging           # Deploy to staging
```

## 🔧 Configuration

### Environment Variables (Optional)
```bash
export S3_BUCKET="drsheelasclinic"
export AWS_REGION="us-west-2"
export CLOUDFRONT_DISTRIBUTION_ID="E2PLUVBGMZ4ZYL"
```

### Staging Environment
The advanced script supports staging deployments:
- Staging bucket: `drsheelasclinic-staging`
- Use `--staging` flag for staging deployments

## 📊 Monitoring Deployment

### Check S3 Upload
```bash
aws s3 ls s3://drsheelasclinic --recursive
```

### Check CloudFront Status
```bash
aws cloudfront list-invalidations --distribution-id E2PLUVBGMZ4ZYL
```

### Verify Website
Visit: http://drsheelasclinic.s3-website-us-west-2.amazonaws.com

## 🚨 Troubleshooting

### Common Issues

1. **AWS CLI not configured**
   ```bash
   aws configure
   ```

2. **Permission denied to S3 bucket**
   - Check AWS credentials
   - Verify bucket permissions
   - Ensure correct region

3. **CloudFront invalidation fails**
   - Check CloudFront distribution ID
   - Verify AWS permissions for CloudFront

4. **Build fails**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Logs and Debugging
```bash
# Enable verbose AWS CLI output
export AWS_CLI_AUTO_PROMPT=off
./deploy.sh

# Check AWS CLI configuration
aws configure list
aws sts get-caller-identity
```

## 🔒 Security Considerations

1. **AWS Credentials**: Store securely, never commit to git
2. **S3 Bucket Policy**: Ensure proper permissions
3. **CloudFront**: Configure appropriate caching policies
4. **HTTPS**: Consider setting up custom domain with SSL

## 📝 Deployment Checklist

- [ ] AWS CLI installed and configured
- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] S3 bucket accessible
- [ ] CloudFront distribution configured
- [ ] Test deployment on staging first
- [ ] Verify website functionality after deployment

## 🆘 Support

For deployment issues:
1. Check AWS CloudTrail logs
2. Verify S3 bucket permissions
3. Check CloudFront distribution status
4. Review build logs for errors

