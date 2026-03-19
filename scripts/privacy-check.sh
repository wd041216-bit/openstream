#!/bin/bash

# OpenStream Privacy Check Script
# Scans for sensitive information that should never be committed

set -e

echo "🔍 OpenStream Privacy Check v1.0"
echo "================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ISSUES_FOUND=0

# Check for GitHub tokens
echo "Checking for GitHub tokens..."
if grep -r "ghp_\|gho_\|ghu_\|ghs_\|ghr_" --include="*.ts" --include="*.js" --include="*.json" --include="*.md" . 2>/dev/null | grep -v "privacy-check.sh"; then
    echo -e "${RED}❌ Found GitHub tokens!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓ No GitHub tokens found${NC}"
fi

# Check for API keys
echo "Checking for API keys..."
if grep -r "api_key\|apikey\|api-key" --include="*.ts" --include="*.js" --include="*.json" --include="*.sh" . 2>/dev/null | grep -v "YOUR_API_KEY_HERE" | grep -v "placeholder" | grep -v "example"; then
    echo -e "${RED}❌ Found potential API keys!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓ No API keys found${NC}"
fi

# Check for passwords
echo "Checking for passwords..."
if grep -r "password\|passwd\|pwd" --include="*.ts" --include="*.js" --include="*.json" . 2>/dev/null | grep -v "# " | grep -v "// " | grep -v "placeholder"; then
    echo -e "${YELLOW}⚠ Found password references (check if intentional)${NC}"
fi

# Check for secrets
echo "Checking for secrets..."
if grep -r "secret\|SECRET" --include="*.ts" --include="*.js" --include="*.json" . 2>/dev/null | grep -v "YOUR_SECRET_HERE" | grep -v "# Secret" | grep -v "// Secret" | grep -v "placeholder"; then
    echo -e "${YELLOW}⚠ Found secret references (check if intentional)${NC}"
fi

# Check for .env files
echo "Checking for .env files..."
if find . -name ".env" -o -name ".env.*" 2>/dev/null | grep -v node_modules; then
    echo -e "${RED}❌ Found .env files!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓ No .env files found${NC}"
fi

# Check for private keys
echo "Checking for private keys..."
if find . -name "*.pem" -o -name "*.key" -o -name "*.p12" 2>/dev/null | grep -v node_modules; then
    echo -e "${RED}❌ Found private key files!${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✓ No private key files found${NC}"
fi

# Check .gitignore completeness
echo "Checking .gitignore completeness..."
REQUIRED_IGNORES=("node_modules" ".env" "*.env" "secrets" "*.secret" "*.pem" "*.key")
for ignore in "${REQUIRED_IGNORES[@]}"; do
    if ! grep -q "$ignore" .gitignore 2>/dev/null; then
        echo -e "${YELLOW}⚠ Missing .gitignore entry: $ignore${NC}"
    fi
done
echo -e "${GREEN}✓ .gitignore checked${NC}"

# Check for email addresses in comments
echo "Checking for email addresses in comments..."
if grep -r "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" --include="*.ts" --include="*.js" --include="*.sh" --include="*.md" . 2>/dev/null | grep -v "example.com" | grep -v "placeholder" | grep -v "users.noreply.github"; then
    echo -e "${YELLOW}⚠ Found email addresses (check if personal)${NC}"
fi

echo ""
echo "================================="
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ Privacy check passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Privacy check found $ISSUES_FOUND issue(s)!${NC}"
    echo "Please review and fix the issues above before committing."
    exit 1
fi