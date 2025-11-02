#!/bin/bash

# Script to switch between AWS accounts for the clinic app deployment
# Usage: ./switch-aws-account.sh [seedling|abhed]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AWS_CONFIG_FILE="$HOME/.aws/config"
AWS_CREDENTIALS_FILE="$HOME/.aws/credentials"

# Define account configurations
SEEDLING_ACCOUNT_ID="143320675925"
ABHED_ACCOUNT_ID=""  # Will be detected or can be set manually

# Function to save current configuration
save_current_config() {
    if [ -f "$AWS_CONFIG_FILE" ]; then
        cp "$AWS_CONFIG_FILE" "$SCRIPT_DIR/.aws-config-seedling.bak"
        echo "✅ Saved current AWS config to .aws-config-seedling.bak"
    fi
    
    if [ -f "$AWS_CREDENTIALS_FILE" ]; then
        cp "$AWS_CREDENTIALS_FILE" "$SCRIPT_DIR/.aws-credentials-seedling.bak"
        echo "✅ Saved current AWS credentials to .aws-credentials-seedling.bak"
    fi
}

# Function to restore Seedling account configuration
restore_seedling_config() {
    if [ -f "$SCRIPT_DIR/.aws-config-seedling.bak" ]; then
        cp "$SCRIPT_DIR/.aws-config-seedling.bak" "$AWS_CONFIG_FILE"
        echo "✅ Restored Seedling AWS config"
    fi
    
    if [ -f "$SCRIPT_DIR/.aws-credentials-seedling.bak" ]; then
        cp "$SCRIPT_DIR/.aws-credentials-seedling.bak" "$AWS_CREDENTIALS_FILE"
        echo "✅ Restored Seedling AWS credentials"
    fi
}

# Function to setup Abhed account configuration
setup_abhed_config() {
    echo "🔧 Setting up Abhed AWS account configuration..."
    
    # Check for credentials in environment variables
    if [ -z "$ABHED_AWS_ACCESS_KEY_ID" ] || [ -z "$ABHED_AWS_SECRET_ACCESS_KEY" ]; then
        echo ""
        echo "Please set the following environment variables:"
        echo "  export ABHED_AWS_ACCESS_KEY_ID='your-access-key'"
        echo "  export ABHED_AWS_SECRET_ACCESS_KEY='your-secret-key'"
        echo ""
        echo "Or enter credentials when prompted:"
        echo ""
        
        read -p "AWS Access Key ID: " ACCESS_KEY
        read -sp "AWS Secret Access Key: " SECRET_KEY
        echo ""
    else
        ACCESS_KEY="$ABHED_AWS_ACCESS_KEY_ID"
        SECRET_KEY="$ABHED_AWS_SECRET_ACCESS_KEY"
    fi
    
    read -p "AWS Region (default: us-west-2): " REGION
    REGION=${REGION:-us-west-2}
    
    # Update credentials file
    cat > "$AWS_CREDENTIALS_FILE" << EOF
[default]
aws_access_key_id = $ACCESS_KEY
aws_secret_access_key = $SECRET_KEY
EOF
    
    # Update config
    cat > "$AWS_CONFIG_FILE" << EOF
[default]
region = $REGION
output = json
EOF
    
    echo ""
    echo "✅ Abhed AWS account configured"
    verify_connection
}

# Function to verify AWS connection
verify_connection() {
    echo ""
    echo "🔍 Verifying AWS connection..."
    
    if aws sts get-caller-identity &> /dev/null; then
        ACCOUNT_INFO=$(aws sts get-caller-identity)
        ACCOUNT_ID=$(echo "$ACCOUNT_INFO" | grep -o '"Account": "[^"]*' | cut -d'"' -f4)
        ARN=$(echo "$ACCOUNT_INFO" | grep -o '"Arn": "[^"]*' | cut -d'"' -f4)
        
        echo "✅ Successfully connected to AWS"
        echo "   Account ID: $ACCOUNT_ID"
        echo "   ARN: $ARN"
        
        if [ "$ACCOUNT_ID" = "$SEEDLING_ACCOUNT_ID" ]; then
            echo "   Current Account: 🌱 Seedling AWS Account"
        else
            echo "   Current Account: 🏥 Abhed AWS Account (Clinic App)"
        fi
    else
        echo "❌ Failed to connect to AWS"
        echo "   Please check your credentials and try again"
        exit 1
    fi
}

# Main script logic
if [ -z "$1" ]; then
    echo "🏥 AWS Account Switcher for Clinic App"
    echo "======================================"
    echo ""
    echo "Current AWS account:"
    verify_connection
    echo ""
    echo "Usage: $0 [seedling|abhed]"
    echo ""
    echo "Options:"
    echo "  seedling  - Switch to Seedling AWS Account (143320675925)"
    echo "  abhed     - Switch to Abhed AWS Account (Clinic App)"
    echo ""
    exit 0
fi

case "$1" in
    seedling)
        echo "🌱 Switching to Seedling AWS Account..."
        if [ ! -f "$SCRIPT_DIR/.aws-config-seedling.bak" ]; then
            echo "⚠️  No backup found for Seedling account."
            echo "   Current configuration will be used."
        else
            restore_seedling_config
        fi
        verify_connection
        echo ""
        echo "✅ Switched to Seedling AWS Account"
        ;;
    abhed)
        echo "🏥 Switching to Abhed AWS Account (Clinic App)..."
        if [ ! -f "$SCRIPT_DIR/.aws-config-seedling.bak" ]; then
            echo "📦 Saving current Seedling AWS configuration..."
            save_current_config
        fi
        setup_abhed_config
        echo ""
        echo "✅ Switched to Abhed AWS Account"
        ;;
    *)
        echo "❌ Invalid option: $1"
        echo "Usage: $0 [seedling|abhed]"
        exit 1
        ;;
esac

echo ""
echo "📝 Current AWS Configuration:"
aws configure list

