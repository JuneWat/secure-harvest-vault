#!/bin/bash

# Secure Harvest Vault - Git Push Script (Linux/Mac Bash)
# This script automatically commits and pushes changes to GitHub

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Secure Harvest Vault - Git Push Script${NC}"
echo -e "${GREEN}==============================================${NC}"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not a git repository!${NC}"
    exit 1
fi

# Check git status
echo -e "${CYAN}📊 Checking git status...${NC}"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}ℹ️  No changes to commit. Working tree is clean.${NC}"
    exit 0
fi

echo -e "${YELLOW}📝 Changes detected:${NC}"
git status --short
echo ""

# Generate commit message
COMMIT_MESSAGE=""
FORCE_PUSH=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE_PUSH=true
            shift
            ;;
        *)
            COMMIT_MESSAGE="$1"
            shift
            ;;
    esac
done

if [ -z "$COMMIT_MESSAGE" ]; then
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    COMMIT_MESSAGE="Update: $TIMESTAMP"
    echo -e "${CYAN}📝 Using auto-generated commit message: '$COMMIT_MESSAGE'${NC}"
else
    echo -e "${CYAN}📝 Using provided commit message: '$COMMIT_MESSAGE'${NC}"
fi

echo ""

# Add all changes
echo -e "${CYAN}➕ Adding all changes...${NC}"
git add -A

# Commit changes
echo -e "${CYAN}💾 Committing changes...${NC}"
git commit -m "$COMMIT_MESSAGE"

echo -e "${GREEN}✅ Changes committed successfully!${NC}"
echo ""

# Push to GitHub
echo -e "${CYAN}🚀 Pushing to GitHub...${NC}"

if [ "$FORCE_PUSH" = true ]; then
    echo -e "${YELLOW}⚠️  Using force push!${NC}"
    git push --force origin master:main
else
    git push origin master:main
fi

echo ""
echo -e "${GREEN}🎉 Successfully pushed to GitHub!${NC}"
echo -e "${GREEN}🌐 Repository: https://github.com/JuneWat/secure-harvest-vault${NC}"

# Show latest commit
echo ""
echo -e "${CYAN}📋 Latest commit:${NC}"
git log --oneline -1
