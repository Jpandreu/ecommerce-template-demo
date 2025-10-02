# 🚀 Automated Demo Deploy Script for ThemeForest
# Run this script to prepare and deploy your demo to GitHub Pages

param(
    [string]$GitHubUsername,
    [string]$RepoName = "ecommerce-template-demo"
)

Write-Host "🛍️ Professional Ecommerce Template - Demo Deploy Script" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# Check if GitHub username is provided
if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "Enter your GitHub username"
}

Write-Host "`n📋 Deployment Checklist:" -ForegroundColor Yellow

# Step 1: Check Git installation
Write-Host "`n1. Checking Git installation..." -ForegroundColor Green
try {
    $gitVersion = git --version
    Write-Host "   ✅ Git is installed: $gitVersion" -ForegroundColor White
} catch {
    Write-Host "   ❌ Git not found. Please install Git first." -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/" -ForegroundColor Yellow
    exit 1
}

# Step 2: Initialize repository
Write-Host "`n2. Initializing Git repository..." -ForegroundColor Green
if (-not (Test-Path ".git")) {
    git init
    Write-Host "   ✅ Git repository initialized" -ForegroundColor White
} else {
    Write-Host "   ✅ Git repository already exists" -ForegroundColor White
}

# Step 3: Update URLs in files
Write-Host "`n3. Updating demo URLs..." -ForegroundColor Green
$demoUrl = "https://$GitHubUsername.github.io/$RepoName"

# Update PUBLIC-README.md (replace DEMO-README.md)
if (Test-Path "PUBLIC-README.md") {
    $publicReadme = Get-Content "PUBLIC-README.md" -Raw
    $publicReadme = $publicReadme -replace "https://your-username.github.io/ecommerce-template-demo", $demoUrl
    $publicReadme = $publicReadme -replace "your-username", $GitHubUsername
    Set-Content "README.md" $publicReadme
    Write-Host "   ✅ Created public README.md" -ForegroundColor White
}

# Skip updating DEMO-CONFIG.md (private file)
Write-Host "   ✅ Skipped private configuration files" -ForegroundColor White

# Update demo.html
$demoHtml = Get-Content "demo.html" -Raw
$demoHtml = $demoHtml -replace "https://github.com/your-username/ecommerce-template-demo", "https://github.com/$GitHubUsername/$RepoName"
$demoHtml = $demoHtml -replace "tu-email@gmail.com", (Read-Host "Ingresa tu email de contacto")
Set-Content "demo.html" $demoHtml
Write-Host "   ✅ Updated demo.html with purchase links" -ForegroundColor White

# Update index.html demo banner
$indexHtml = Get-Content "index.html" -Raw
$indexHtml = $indexHtml -replace "https://github.com/your-username/ecommerce-template-demo", "https://github.com/$GitHubUsername/$RepoName"
Set-Content "index.html" $indexHtml
Write-Host "   ✅ Updated index.html" -ForegroundColor White

# Step 4: Create/update package.json
Write-Host "`n4. Updating package.json..." -ForegroundColor Green
if (Test-Path "package.json") {
    $package = Get-Content "package.json" -Raw | ConvertFrom-Json
    $package.repository.url = "https://github.com/$GitHubUsername/$RepoName"
    $package | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    Write-Host "   ✅ Updated package.json repository URL" -ForegroundColor White
}

# Step 5: Add all files
Write-Host "`n5. Adding files to Git..." -ForegroundColor Green
git add .
Write-Host "   ✅ All files added to Git staging" -ForegroundColor White

# Step 6: Commit changes
Write-Host "`n6. Committing changes..." -ForegroundColor Green
$commitMessage = "🚀 Initial commit - Professional Ecommerce Template Demo for ThemeForest"
git commit -m $commitMessage
Write-Host "   ✅ Changes committed" -ForegroundColor White

# Step 7: Instructions for GitHub setup
Write-Host "`n7. GitHub Repository Setup Instructions:" -ForegroundColor Yellow
Write-Host "   📝 Manual steps (do these on GitHub.com):" -ForegroundColor White
Write-Host "   1. Go to https://github.com/new" -ForegroundColor Gray
Write-Host "   2. Repository name: $RepoName" -ForegroundColor Gray
Write-Host "   3. Description: Professional Ecommerce Template - ThemeForest Demo" -ForegroundColor Gray
Write-Host "   4. Make it Public (required for free GitHub Pages)" -ForegroundColor Gray
Write-Host "   5. Don't add README, .gitignore, or license (we have them)" -ForegroundColor Gray
Write-Host "   6. Click 'Create repository'" -ForegroundColor Gray

Write-Host "`n   🔗 After creating the repository, run these commands:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray

# Step 8: GitHub Pages setup instructions
Write-Host "`n8. GitHub Pages Setup:" -ForegroundColor Yellow
Write-Host "   After pushing to GitHub:" -ForegroundColor White
Write-Host "   1. Go to repository Settings" -ForegroundColor Gray
Write-Host "   2. Scroll to 'Pages' section" -ForegroundColor Gray
Write-Host "   3. Source: 'Deploy from a branch'" -ForegroundColor Gray
Write-Host "   4. Branch: 'main' / (root)" -ForegroundColor Gray
Write-Host "   5. Click 'Save'" -ForegroundColor Gray
Write-Host "   6. Wait 5-10 minutes for deployment" -ForegroundColor Gray

# Step 9: Final URLs
Write-Host "`n🎯 Your Demo URLs (available after GitHub Pages setup):" -ForegroundColor Cyan
Write-Host "   Demo Landing Page: $demoUrl/demo.html" -ForegroundColor White
Write-Host "   Full Site Demo: $demoUrl/index.html" -ForegroundColor White
Write-Host "   Products Page: $demoUrl/products.html" -ForegroundColor White
Write-Host "   Cart Demo: $demoUrl/cart.html" -ForegroundColor White
Write-Host "   Checkout Demo: $demoUrl/checkout.html" -ForegroundColor White
Write-Host "   Services Demo: $demoUrl/services.html" -ForegroundColor White

# Step 10: Next steps
Write-Host "`n📋 Next Steps for ThemeForest:" -ForegroundColor Green
Write-Host "   1. ✅ Test all demo URLs work correctly" -ForegroundColor White
Write-Host "   2. ✅ Take screenshots using generate-screenshots.ps1" -ForegroundColor White
Write-Host "   3. ✅ Update DEMO-README.md with actual screenshots" -ForegroundColor White
Write-Host "   4. ✅ Test PayPal integration (sandbox mode)" -ForegroundColor White
Write-Host "   5. ✅ Verify responsive design on all devices" -ForegroundColor White
Write-Host "   6. ✅ Check loading speed and performance" -ForegroundColor White
Write-Host "   7. ✅ Validate HTML/CSS" -ForegroundColor White
Write-Host "   8. ✅ Prepare ThemeForest submission package" -ForegroundColor White

Write-Host "`n💰 ThemeForest Submission Tips:" -ForegroundColor Yellow
Write-Host "   • Demo URL is required for approval" -ForegroundColor White
Write-Host "   • Include detailed documentation" -ForegroundColor White
Write-Host "   • Add high-quality screenshots" -ForegroundColor White
Write-Host "   • Set competitive pricing ($19-29 regular license)" -ForegroundColor White
Write-Host "   • Use relevant tags: ecommerce, paypal, responsive, professional" -ForegroundColor White
Write-Host "   • Provide comprehensive feature list" -ForegroundColor White

Write-Host "`n🎉 Demo preparation completed!" -ForegroundColor Green
Write-Host "Total cost: $0 (using GitHub Student benefits)" -ForegroundColor Cyan

# Create a summary file
$summary = @"
# 🚀 Demo Deployment Summary

## ✅ Completed Tasks
- [x] Git repository initialized
- [x] Demo files created and configured
- [x] URLs updated with your GitHub username
- [x] Files committed to Git
- [x] GitHub Actions workflow configured
- [x] Documentation prepared

## 🔗 Your Demo URLs
- **Demo Landing**: $demoUrl/demo.html
- **Full Site**: $demoUrl/index.html
- **Products**: $demoUrl/products.html  
- **Cart**: $demoUrl/cart.html
- **Checkout**: $demoUrl/checkout.html
- **Services**: $demoUrl/services.html

## 📋 Manual Steps Remaining
1. Create GitHub repository: $RepoName
2. Push code to GitHub
3. Enable GitHub Pages
4. Take screenshots
5. Test all functionality
6. Submit to ThemeForest

## 💡 Quick Commands
```bash
git remote add origin https://github.com/$GitHubUsername/$RepoName.git
git branch -M main  
git push -u origin main
```

## 🎯 ThemeForest Ready
- ✅ Professional demo site
- ✅ Complete documentation
- ✅ Responsive design
- ✅ PayPal integration
- ✅ SEO optimized
- ✅ $0 hosting cost

Generated: $(Get-Date)
"@

Set-Content "DEPLOYMENT-SUMMARY.md" $summary
Write-Host "`n📄 Summary saved to DEPLOYMENT-SUMMARY.md" -ForegroundColor Green