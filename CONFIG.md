# 🛠️ Template Configuration Guide

## Quick Setup Instructions

This guide will help you customize the Professional Ecommerce Template for your business.

## 📝 Basic Information

### 1. Business Information
Edit the following in all HTML files:

```html
<!-- Company Name -->
YourStore → [Your Business Name]

<!-- Contact Information -->
+34 123 456 789 → [Your Phone]
info@yourstore.com → [Your Email]
Example Street, 123, 28001 Madrid, Spain → [Your Address]
```

### 2. Logo and Branding
Replace these files in `assets/images/`:
- `logo.svg` - Main logo (light backgrounds)
- `logo-white.svg` - White logo (dark backgrounds)  
- `favicon.ico` - Browser tab icon

### 3. Colors and Styling
Edit `assets/css/styles.css` variables:

```css
:root {
    --primary-color: #2563eb;     /* Your primary brand color */
    --primary-dark: #1d4ed8;      /* Darker shade */
    --accent-color: #f59e0b;      /* Accent color */
    --text-primary: #1e293b;      /* Main text color */
    --text-secondary: #64748b;    /* Secondary text */
}
```

## 📍 Google Maps Setup

### Update Map Location
In `index.html`, find the iframe and replace coordinates:

```html
<iframe src="https://www.google.com/maps/embed?pb=YOUR_COORDINATES_HERE">
```

**How to get coordinates:**
1. Go to Google Maps
2. Find your location
3. Right-click and select "What's here?"
4. Copy the coordinates
5. Use Google's Embed API to generate the iframe URL

## 📦 Product Configuration

### Adding Products
Edit `assets/js/products.js`:

```javascript
// Add new products to the products object
'13': {
    name: 'Your Product Name',
    category: 'Your Category',
    image: './assets/images/your-product.jpg',
    description: 'Short description',
    fullDescription: 'Detailed description...',
    price: '$XXX.XX',
    rating: 5,
    reviews: XX,
    brand: 'Your Brand',
    // ... more properties
}
```

### Product Images
Add product images to `assets/images/`:
- `product-X.jpg` - Main product image
- `product-X-2.jpg` - Alternative view (optional)
- `product-X-3.jpg` - Another view (optional)

## 🔧 Analytics Setup

### Google Analytics 4
Edit `assets/js/analytics.js`:

```javascript
const ANALYTICS_CONFIG = {
    GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Your GA4 ID
    enableEcommerce: true,
    // ... other settings
};
```

### Facebook Pixel
```javascript
const FACEBOOK_CONFIG = {
    PIXEL_ID: 'XXXXXXXXXXXXXX', // Your Pixel ID
    // ... other settings
};
```

### Google Tag Manager
```javascript
const GTM_CONFIG = {
    CONTAINER_ID: 'GTM-XXXXXXX' // Your GTM Container ID
};
```

## 📧 Forms Configuration

### Contact Form Backend
Edit `assets/js/main.js` to connect with your backend:

```javascript
function submitContactForm() {
    // Replace with your form submission logic
    fetch('YOUR_BACKEND_URL/contact', {
        method: 'POST',
        // ... form data
    });
}
```

### Newsletter Integration
Connect with your email service (Mailchimp, ConvertKit, etc.):

```javascript
function submitNewsletter() {
    // Replace with your newsletter service API
    fetch('YOUR_EMAIL_SERVICE_API', {
        method: 'POST',
        // ... email data
    });
}
```

## 🛡️ Security & SEO

### Update Sitemap
Edit `sitemap.xml` with your domain:
```xml
<loc>https://yourstore.com/</loc>
```

### Update Robots.txt
Edit `robots.txt` with your sitemap URL:
```
Sitemap: https://yourstore.com/sitemap.xml
```

### Schema.org Data
Update structured data in HTML files:
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Business Name",
    "url": "https://yourdomain.com",
    // ... update all business information
}
</script>
```

## 💳 Payment Integration

### Checkout Customization
Edit `assets/js/checkout.js` to integrate with your payment processor:

```javascript
async processOrder() {
    // Replace with your payment processing logic
    // Stripe, PayPal, Square, etc.
}
```

### Supported Payment Methods
Update payment options in `checkout.html`:
- Credit/Debit Cards
- PayPal  
- Bank Transfer
- Digital Wallets

## 🎨 Content Customization

### Homepage Content
Edit `index.html`:
- Hero section text
- Featured products
- Testimonials (replace with real customer reviews)
- Service descriptions

### Product Descriptions
Update product information in `products.js`:
- Names and descriptions
- Prices and categories  
- Features and specifications
- Images and galleries

### Service Offerings
Edit `services.html`:
- Service descriptions
- Pricing tiers
- Process steps
- Contact information

## 📱 Mobile Optimization

The template is fully responsive, but you may want to:
1. Test on various devices
2. Optimize images for mobile
3. Adjust text sizes if needed
4. Test touch interactions

## 🚀 Deployment Checklist

### Before Going Live:
- [ ] Replace all placeholder content
- [ ] Update contact information  
- [ ] Configure Google Maps
- [ ] Set up analytics tracking
- [ ] Test all forms
- [ ] Verify payment integration
- [ ] Test on mobile devices
- [ ] Check loading speed
- [ ] Verify SEO elements
- [ ] Test 404 page

### Performance Optimization:
- [ ] Compress images
- [ ] Minify CSS/JS files  
- [ ] Enable GZIP compression
- [ ] Set up CDN (optional)
- [ ] Configure caching headers

## 📞 Support

### Technical Issues:
1. Check browser console for errors
2. Verify file paths are correct
3. Test in different browsers
4. Check mobile compatibility

### Customization Help:
- CSS modifications: Edit `assets/css/styles.css`
- JavaScript functionality: Edit respective JS files
- HTML structure: Edit individual HTML files
- Images: Replace files in `assets/images/`

## 📚 Documentation Files:
- `README.md` - Project overview
- `LICENSE.md` - License terms  
- `IMAGE-SYSTEM.md` - Image management details
- `CONFIG.md` - This configuration guide

---

**© 2025 Josep Andreu - Professional Ecommerce Template**

For additional support, refer to the LICENSE.md file for contact information.