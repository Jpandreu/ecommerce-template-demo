# Screenshot Generation Script for Demo
# Run this after setting up the demo site

# Create screenshots directory
New-Item -ItemType Directory -Force -Path "demo-screenshots"

Write-Host "📸 Screenshot Generation Guide for ThemeForest Demo" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host "`n🎯 Required Screenshots for ThemeForest:" -ForegroundColor Yellow
Write-Host "1. Homepage (desktop & mobile)" -ForegroundColor White
Write-Host "2. Products page (desktop & mobile)" -ForegroundColor White
Write-Host "3. Product modal/detail view" -ForegroundColor White
Write-Host "4. Shopping cart page" -ForegroundColor White
Write-Host "5. Checkout process" -ForegroundColor White
Write-Host "6. Services page with contact form" -ForegroundColor White

Write-Host "`n📐 Recommended Screenshot Sizes:" -ForegroundColor Yellow
Write-Host "• Main preview: 1200x800px (ThemeForest requirement)" -ForegroundColor White
Write-Host "• Additional previews: 1200x900px" -ForegroundColor White
Write-Host "• Mobile screenshots: 375x812px (iPhone size)" -ForegroundColor White

Write-Host "`n🛠️ Tools for Screenshots:" -ForegroundColor Yellow
Write-Host "1. Browser DevTools (F12 > Responsive mode)" -ForegroundColor White
Write-Host "2. Full Page Screenshot extensions" -ForegroundColor White
Write-Host "3. Snipping Tool (Windows) or Screenshot (Mac)" -ForegroundColor White
Write-Host "4. Online tools: screenpresso.com, webpage-screenshot.com" -ForegroundColor White

Write-Host "`n📋 Screenshot Checklist:" -ForegroundColor Yellow

$urls = @(
    "Homepage: https://your-username.github.io/ecommerce-template-demo/index.html",
    "Products: https://your-username.github.io/ecommerce-template-demo/products.html",
    "Cart: https://your-username.github.io/ecommerce-template-demo/cart.html",
    "Checkout: https://your-username.github.io/ecommerce-template-demo/checkout.html",
    "Services: https://your-username.github.io/ecommerce-template-demo/services.html",
    "Demo Landing: https://your-username.github.io/ecommerce-template-demo/demo.html"
)

foreach ($url in $urls) {
    Write-Host "☐ $url" -ForegroundColor White
}

Write-Host "`n🎨 Screenshot Tips:" -ForegroundColor Yellow
Write-Host "• Clear browser cache before screenshots" -ForegroundColor White
Write-Host "• Use incognito mode for clean screenshots" -ForegroundColor White
Write-Host "• Add some products to cart for cart screenshot" -ForegroundColor White
Write-Host "• Show mobile navigation menu in mobile shots" -ForegroundColor White
Write-Host "• Capture product modal open for detail view" -ForegroundColor White
Write-Host "• Include PayPal button in checkout screenshot" -ForegroundColor White

Write-Host "`n💡 Pro Tips:" -ForegroundColor Green
Write-Host "• Use consistent browser zoom (100%)" -ForegroundColor White
Write-Host "• Crop screenshots to remove browser UI" -ForegroundColor White
Write-Host "• Optimize images (PNG for UI, JPG for photos)" -ForegroundColor White
Write-Host "• Keep file sizes under 2MB each" -ForegroundColor White

# Create placeholder files for screenshots
$screenshotFiles = @(
    "homepage-desktop.png",
    "homepage-mobile.png", 
    "products-desktop.png",
    "products-mobile.png",
    "product-modal.png",
    "cart-page.png",
    "checkout-page.png",
    "services-page.png"
)

foreach ($file in $screenshotFiles) {
    $placeholder = "demo-screenshots\$file"
    if (!(Test-Path $placeholder)) {
        New-Item -ItemType File -Path $placeholder -Force | Out-Null
        Write-Host "Created placeholder: $file" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Next Steps:" -ForegroundColor Green
Write-Host "1. Take screenshots of your live demo" -ForegroundColor White
Write-Host "2. Save them in the demo-screenshots folder" -ForegroundColor White
Write-Host "3. Update DEMO-README.md with actual screenshot paths" -ForegroundColor White
Write-Host "4. Commit and push to GitHub" -ForegroundColor White

Write-Host "`n🚀 Demo URL (update with your actual URL):" -ForegroundColor Cyan
Write-Host "https://your-username.github.io/ecommerce-template-demo" -ForegroundColor White