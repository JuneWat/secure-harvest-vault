# Secure Harvest Vault - Git Push Script (Windows PowerShell)
# This script automatically commits and pushes changes to GitHub

param(
    [string]$CommitMessage = "",
    [switch]$Force
)

Write-Host "🔧 Secure Harvest Vault - Git Push Script" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not a git repository!" -ForegroundColor Red
    exit 1
}

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Cyan
$status = git status --porcelain
$hasChanges = $status -and $status.Length -gt 0

if (-not $hasChanges) {
    Write-Host "ℹ️  No changes to commit. Working tree is clean." -ForegroundColor Yellow
    exit 0
}

Write-Host "📝 Changes detected:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Generate commit message if not provided
if (-not $CommitMessage) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $CommitMessage = "Update: $timestamp"
    Write-Host "📝 Using auto-generated commit message: '$CommitMessage'" -ForegroundColor Cyan
} else {
    Write-Host "📝 Using provided commit message: '$CommitMessage'" -ForegroundColor Cyan
}

Write-Host ""

# Add all changes
Write-Host "➕ Adding all changes..." -ForegroundColor Cyan
git add -A

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to add changes!" -ForegroundColor Red
    exit 1
}

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Cyan
git commit -m $CommitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to commit changes!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes committed successfully!" -ForegroundColor Green
Write-Host ""

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan

$pushCommand = "git push origin master:main"

if ($Force) {
    $pushCommand = "git push --force origin master:main"
    Write-Host "⚠️  Using force push!" -ForegroundColor Yellow
}

Invoke-Expression $pushCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to push to GitHub!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "   1. Check your internet connection" -ForegroundColor Yellow
    Write-Host "   2. Verify your GitHub credentials" -ForegroundColor Yellow
    Write-Host "   3. Make sure you have push permissions to the repository" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "🌐 Repository: https://github.com/JuneWat/secure-harvest-vault" -ForegroundColor Green

# Show latest commit
Write-Host ""
Write-Host "📋 Latest commit:" -ForegroundColor Cyan
git log --oneline -1

