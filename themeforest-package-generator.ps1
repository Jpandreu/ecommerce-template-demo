# THEMEFOREST PACKAGE GENERATOR
Write-Host "Creating ThemeForest Package..." -ForegroundColor Green

$sourcePath = Get-Location
$packagePath = Join-Path (Split-Path $sourcePath -Parent) "ThemeForest-Package"
$commercialPath = Join-Path $packagePath "ecommerce-template"

Write-Host "1. Creating package structure..." -ForegroundColor Yellow

# Create folders
New-Item -Path $packagePath -ItemType Directory -Force | Out-Null
New-Item -Path $commercialPath -ItemType Directory -Force | Out-Null

Write-Host "2. Copying main files..." -ForegroundColor Yellow

# Main HTML files
$mainFiles = @(
    "index.html",
    "products.html", 
    "cart.html",
    "checkout.html",
    "services.html",
    "404.html",
    "robots.txt",
    "sitemap.xml"
)

foreach ($file in $mainFiles) {
    if (Test-Path $file) {
        Copy-Item $file $commercialPath -Force
        Write-Host "   Copied: $file" -ForegroundColor Green
    }
}

Write-Host "3. Copying assets folder..." -ForegroundColor Yellow

if (Test-Path "assets") {
    Copy-Item "assets" $commercialPath -Recurse -Force
    Write-Host "   Assets copied successfully" -ForegroundColor Green
}

Write-Host "4. Creating documentation..." -ForegroundColor Yellow

# Create README
$readme = @"
# Modern E-commerce Template

## Professional HTML5 E-commerce Template

A modern, responsive e-commerce template perfect for online stores.

### Key Features
- Fully Responsive Design
- PayPal Integration
- Shopping Cart System
- Modern UI/UX Design
- SEO Optimized
- Cross-browser Compatible
- Easy Customization
- Fast Performance

### Package Contents
- 6 HTML5 pages
- CSS3 stylesheets  
- JavaScript components
- PayPal integration
- Shopping cart functionality
- High-quality images
- Documentation

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Quick Setup
1. Upload files to web server
2. Configure PayPal Client ID
3. Customize colors and content
4. Launch your store

### Support
- 6 months support included
- Detailed documentation
- Email assistance

Version: 1.0
Created: October 2025
"@

$readme | Out-File -FilePath (Join-Path $commercialPath "README.md") -Encoding UTF8

# Create Installation Guide
$installation = @"
# INSTALLATION GUIDE

## Quick Setup (5 Minutes)

### Step 1: Upload Files
Upload all files to your web server maintaining the folder structure.

### Step 2: PayPal Configuration  
Edit assets/js/checkout.js and replace:
client-id: 'YOUR-PAYPAL-CLIENT-ID'

Get your Client ID from https://developer.paypal.com

### Step 3: Customization

#### Colors (assets/css/styles.css)
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d; 
    --accent-color: #28a745;
}

#### Content Areas
- index.html: Homepage content
- products.html: Product catalog
- checkout.html: Payment forms
- services.html: Service information

### Step 4: Testing
Test all functionality including:
- Responsive design
- PayPal integration
- Form validation
- Cart functionality

### Support
Email: support@yoursite.com
Response time: 24-48 hours
Support period: 6 months
"@

$installation | Out-File -FilePath (Join-Path $commercialPath "INSTALLATION.md") -Encoding UTF8

Write-Host "5. Cleaning demo files..." -ForegroundColor Yellow

# Remove demo-specific files
$filesToRemove = @(
    "demo.html",
    "deploy-demo.ps1",
    "DEMO-*.md",
    "THEMEFOREST-*.md",
    "GUIA-*.md",
    "create-themeforest-package.ps1"
)

foreach ($pattern in $filesToRemove) {
    Get-ChildItem -Path $commercialPath -Name $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item (Join-Path $commercialPath $_) -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "6. Creating license file..." -ForegroundColor Yellow

$license = @"
LICENSE

Regular License

This license allows you to use this template for a single website.

What you CAN do:
- Use for one website/application
- Modify and customize the code
- Use for personal or commercial projects
- Create website for yourself or client

What you CANNOT do:
- Resell or redistribute the template
- Use on multiple websites without additional licenses
- Create competing templates
- Share source code with third parties

Support: 6 months included
Refunds: Available only for technical issues

Copyright $(Get-Date -Format 'yyyy') - All rights reserved
"@

$license | Out-File -FilePath (Join-Path $commercialPath "LICENSE.txt") -Encoding UTF8

Write-Host "7. Creating ZIP package..." -ForegroundColor Yellow

$zipPath = Join-Path $packagePath "ecommerce-template-themeforest.zip"

# Create ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($commercialPath, $zipPath)

Write-Host "" 
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   THEMEFOREST PACKAGE READY!" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Package location: $packagePath" -ForegroundColor Yellow
Write-Host "ZIP file: $zipPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review files in commercial folder"
Write-Host "2. Test template on clean server"  
Write-Host "3. Create preview screenshots"
Write-Host "4. Write product description"
Write-Host "5. Submit to ThemeForest"
Write-Host ""
Write-Host "Your template is ready for ThemeForest!" -ForegroundColor Green