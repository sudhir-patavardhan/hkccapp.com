# AWS Account Switcher

This script helps you switch between different AWS accounts for deploying the clinic app.

## Available Accounts

1. **🌱 Seedling AWS Account** (`143320675925`)
   - Current default account
   - Personal/learning projects

2. **🏥 Abhed AWS Account** 
   - Clinic application deployment account
   - Contains Lambda functions, S3 bucket (`drsheelasclinic`), CloudFront

## Usage

### Check Current Account
```bash
./switch-aws-account.sh
```
This will show which AWS account you're currently connected to.

### Switch to Abhed Account (Clinic App)
```bash
./switch-aws-account.sh abhed
```
- Automatically saves current Seedling configuration
- Prompts for Abhed AWS credentials
- Sets up the new configuration
- Verifies connection

### Switch Back to Seedling Account
```bash
./switch-aws-account.sh seedling
```
- Restores saved Seedling configuration
- Verifies connection

## How It Works

1. **First Time**: When switching to Abhed, the script saves your current Seedling credentials as backup files:
   - `.aws-config-seedling.bak`
   - `.aws-credentials-seedling.bak`

2. **Subsequent Switches**: 
   - Switching to Abhed uses the saved backup
   - Switching to Seedling restores from backup

3. **Credentials**: Stored in `~/.aws/` directory:
   - `~/.aws/config` - Configuration file
   - `~/.aws/credentials` - Access keys

## Security Notes

- Backup files are stored in the project directory (`.aws-*-seedling.bak`)
- These files contain sensitive credentials - **NEVER commit them to git!**
- Consider adding to `.gitignore`:
  ```
  .aws-*-seedling.bak
  ```

## Troubleshooting

### "No backup found"
If you see this when switching to Seedling:
- It means backup wasn't created yet
- Your current config will be used

### Wrong Account
If you connect to the wrong account:
- Check `aws configure list` to see current credentials
- Re-run the script to switch accounts

### Permission Errors
If you get permission errors:
- Check AWS credentials are correct
- Verify IAM permissions for the user
- Check the AWS region matches (us-west-2)

## Verifying Deployment Environment

After switching to Abhed account, verify you're in the right environment:

```bash
# Check current account
aws sts get-caller-identity

# List Lambda functions
aws lambda list-functions --region us-west-2 --query 'Functions[*].FunctionName'

# Should see clinic-related functions like:
# - insertVisit
# - getVisit
# - bookAppointment
# etc.
```

## Next Steps

Once connected to Abhed account:
1. Deploy Lambda functions: `cd lambda/scripts && ./deploy_lambda.sh insertVisit`
2. Deploy frontend: `./deploy.sh` or `npm run deploy`
3. Switch back when done: `./switch-aws-account.sh seedling`

