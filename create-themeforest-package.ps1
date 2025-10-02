# 🎯 THEMEFOREST SUBMISSION PACKAGE GENERATOR
# Este script prepara tu plantilla para ThemeForest

Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "    THEMEFOREST PACKAGE GENERATOR" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan

$sourcePath = Get-Location
$packagePath = Join-Path (Split-Path $sourcePath -Parent) "ThemeForest-Package"
$commercialPath = Join-Path $packagePath "ecommerce-template"

Write-Host "`n1️⃣  Creando estructura del paquete..." -ForegroundColor Green

# Crear carpetas
New-Item -Path $packagePath -ItemType Directory -Force | Out-Null
New-Item -Path $commercialPath -ItemType Directory -Force | Out-Null

Write-Host "✅ Carpeta del paquete creada en: $packagePath"

Write-Host "`n2️⃣  Copiando archivos principales..." -ForegroundColor Green

# Archivos HTML principales
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
        Write-Host "   ✓ $file copiado"
    }
}

Write-Host "`n3️⃣  Copiando assets..." -ForegroundColor Green

# Copiar assets completos
if (Test-Path "assets") {
    Copy-Item "assets" $commercialPath -Recurse -Force
    Write-Host "   ✓ Assets copiados (CSS, JS, Images)"
}

Write-Host "`n4️⃣  Creando documentación..." -ForegroundColor Green

# README principal
$readmeContent = @"
# Modern E-commerce Template

## 🛒 Professional HTML5 E-commerce Template

A modern, responsive e-commerce template perfect for online stores, retail businesses, and digital marketplaces.

### ✨ Key Features

- **Fully Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Clean, professional design
- **E-commerce Ready** - Shopping cart & checkout
- **PayPal Integration** - Secure payment processing
- **SEO Optimized** - Clean markup & meta tags
- **Cross-browser Compatible** - All modern browsers
- **Easy Customization** - Well-documented code
- **Fast Performance** - Optimized loading

### 📦 Package Contents

- **HTML Files** - 6 responsive pages
- **CSS Stylesheets** - Modular, organized styles
- **JavaScript** - Interactive components
- **Images** - High-quality demo images
- **Documentation** - Detailed setup guide

### 🚀 Quick Setup

1. Upload files to your web server
2. Configure PayPal Client ID (see documentation)
3. Customize colors and content
4. Launch your store!

### 💻 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 320px - 767px

### 🔧 Technical Requirements

- Modern web server (Apache/Nginx)
- HTTPS recommended for payments
- No database required

### 📞 Support

- 6 months of support included
- Detailed documentation
- Email assistance

---

**Version:** 1.0  
**Created:** $(Get-Date -Format 'MMMM yyyy')  
**License:** Regular License (Single Use)
"@

$readmeContent | Out-File -FilePath (Join-Path $commercialPath "README.md") -Encoding UTF8

Write-Host "   ✓ README.md creado"

# Installation Guide
$installContent = @"
# INSTALLATION GUIDE

## Quick Start (5 Minutes)

### Step 1: Upload Files
- Upload all files to your web server
- Maintain the folder structure exactly as provided
- Ensure proper file permissions

### Step 2: PayPal Configuration

Edit assets/js/checkout.js and find this line:

// Replace with your PayPal Client ID
client-id: 'YOUR-PAYPAL-CLIENT-ID'

To get your PayPal Client ID:
- Go to https://developer.paypal.com
- Create a developer account
- Create a new app
- Copy your Client ID and replace the placeholder

### Step 3: Customize Content

#### Colors & Branding
Edit assets/css/styles.css (lines 1-20):

:root {
    --primary-color: #007bff;    
    --secondary-color: #6c757d;  
    --accent-color: #28a745;     
}

#### Logo & Images
- Replace assets/images/logo.svg with your logo
- Replace product images in assets/images/
- Update assets/images/favicon.ico

#### Contact Information
Update contact details in:
- index.html (footer section)
- checkout.html (contact forms)
- services.html (contact information)

### Step 4: Content Customization

#### Homepage (index.html)
- Lines 45-60: Hero section
- Lines 80-120: Featured products
- Lines 140-180: Testimonials

#### Products (products.html)
- Update product information
- Replace product images
- Modify prices and descriptions

#### Services (services.html)
- Customize service offerings
- Update pricing information
- Modify contact details

## 🎨 Advanced Customization

### Adding New Products
1. Add product images to assets/images/
2. Edit products.html to include new products
3. Update the product data in assets/js/products.js

### Color Scheme Changes
All colors are controlled by CSS variables in assets/css/styles.css. Simply update the root variables to change your entire color scheme.

### Typography
Fonts can be changed by updating the CSS variables and importing new Google Fonts in the HTML head section.

## 🛠️ Troubleshooting

### PayPal Issues
- Ensure HTTPS is enabled
- Check Client ID is correct
- Verify sandbox/live mode settings

### Responsive Issues
- Clear browser cache
- Check CSS media queries
- Validate HTML structure

### Performance Optimization
- Compress images before upload
- Enable browser caching
- Use CDN for better performance

## 📞 Support

Email: your-support-email@domain.com  
Support Period: 6 months from purchase  
Response Time: 24-48 hours

Need help? We're here to assist you!
"@

$installContent | Out-File -FilePath (Join-Path $commercialPath "INSTALLATION.md") -Encoding UTF8

Write-Host "   ✓ INSTALLATION.md creado"

Write-Host "`n5️⃣  Limpiando archivos de demo..." -ForegroundColor Green

# Remover archivos específicos de demo
$demoFiles = @(
    "demo.html",
    "deploy-demo.ps1", 
    "DEMO-*.md",
    "GUIA-*.md",
    "PLAN-*.md",
    "PRICING-*.md",
    "THEMEFOREST-*.md",
    "prepare-themeforest-zip.ps1",
    "private-management.ps1",
    ".github"
)

foreach ($pattern in $demoFiles) {
    Get-ChildItem -Path $commercialPath -Name $pattern -ErrorAction SilentlyContinue | 
    ForEach-Object { 
        Remove-Item (Join-Path $commercialPath $_) -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   ✓ $_ removido"
    }
}

Write-Host "`n6️⃣  Creando archivo de licencia..." -ForegroundColor Green

$licenseContent = @"
# LICENSE

## Regular License

This license allows you to use this template for a single website or application.

### What you CAN do:
- Use the template for one website/application
- Modify and customize the code
- Use for personal or commercial projects
- Create a website for yourself or a client

### What you CANNOT do:
- Resell or redistribute the template
- Use on multiple websites without additional licenses
- Create competing templates based on this code
- Share the source code with third parties

### Support
- 6 months of support included
- Email assistance for setup and customization
- Bug fixes and minor updates

### Refund Policy
Due to the nature of digital products, refunds are only available if the template has technical issues that cannot be resolved.

For Extended License (multiple use), please purchase the extended version.

---

© $(Get-Date -Format 'yyyy') - All rights reserved
"@

$licenseContent | Out-File -FilePath (Join-Path $commercialPath "LICENSE.txt") -Encoding UTF8

Write-Host "   ✓ LICENSE.txt creado"

Write-Host "`n7️⃣  Creando ZIP para ThemeForest..." -ForegroundColor Green

$zipPath = Join-Path $packagePath "ecommerce-template-themeforest.zip"

# Usar PowerShell 5.0+ compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($commercialPath, $zipPath)

Write-Host "   ✅ ZIP creado: $zipPath"

Write-Host "`n" + "=" * 60 -ForegroundColor Cyan
Write-Host "    ✅ PAQUETE THEMEFOREST LISTO!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "`n📦 Ubicaciones importantes:" -ForegroundColor Yellow
Write-Host "   📁 Carpeta del paquete: $packagePath"
Write-Host "   📁 Archivos comerciales: $commercialPath" 
Write-Host "   📦 ZIP para ThemeForest: $zipPath"

Write-Host "`n🎯 Próximos pasos para ThemeForest:" -ForegroundColor Cyan
Write-Host "   1. Revisar todos los archivos en la carpeta comercial"
Write-Host "   2. Probar la plantilla en un servidor limpio"
Write-Host "   3. Crear screenshots y preview images"
Write-Host "   4. Escribir la descripción del producto"
Write-Host "   5. Subir a ThemeForest para revisión"

Write-Host "`n🚀 ¡Tu plantilla está lista para ThemeForest!"