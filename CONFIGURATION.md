# 🔧 Configuration Guide

This file contains all the settings you need to customize for your ecommerce store.

## 📍 Required Configurations

### 1. PayPal Settings
**File:** `checkout.html` (line ~497)

**Current (Testing):**
```html
<script src="https://www.paypal.com/sdk/js?client-id=AZ9iJD_rQThbLgbXhsW0XDx1sJbAKjiL6wf8C5YGV0vcF7K2hXniErnzw3MQaw8zuEw4Jh7_5q6E7Tmu&currency=USD&disable-funding=credit,card"></script>
```

**For Production:**
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PRODUCTION_CLIENT_ID&currency=USD&disable-funding=credit,card"></script>
```

**How to get your PayPal Client ID:**
1. Create PayPal Business account: https://www.paypal.com/business
2. Go to PayPal Developer Dashboard: https://developer.paypal.com/
3. Create new app and get your client ID
4. Replace `YOUR_PRODUCTION_CLIENT_ID` with your actual client ID

### 2. Google Analytics 4
**File:** `checkout.html` and other pages

**Replace:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**With your GA4 tracking ID**

### 3. Facebook Pixel
**File:** Various pages

**Replace:**
```html
<script>
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

### 4. Google Tag Manager
**File:** Various pages

**Replace:**
```html
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

### 5. Google Maps
**File:** `index.html` (contact section)

**Replace the iframe src with your location:**
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.682...YOUR_EMBED_URL"
```

**How to get embed URL:**
1. Go to Google Maps
2. Search your business address
3. Click Share > Embed a map
4. Copy the URL and replace in iframe src

## 📝 Content Customization

### Business Information
**Files to update:**

**Contact Information (`index.html`, `services.html`, footer sections):**
- Address: Replace with your business address
- Phone: Replace with your business phone
- Email: Replace with your business email
- Hours: Update business hours

**Company Details:**
- Business name in headers and titles
- About us text in hero sections
- Service descriptions in `services.html`

### Products
**File:** `assets/js/products.js`

**Update the products array with your inventory:**
```javascript
const products = [
    {
        id: 1,
        name: "Your Product Name",
        price: "$49.99",
        originalPrice: "$69.99", // Optional
        image: "assets/images/your-product.jpg",
        category: "electronics", // or your category
        rating: 4.5,
        reviews: 127,
        isNew: false,
        isOffer: true,
        description: "Your product description...",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        colors: ["#000000", "#ffffff"], // Optional
        sizes: ["S", "M", "L"], // Optional
        stock: 50
    }
    // Add more products...
];
```

### Images
**Replace files in `assets/images/`:**
- `logo.svg` - Your business logo
- `logo-white.svg` - White version of logo
- `hero-bg.jpg` - Main hero background
- `product-*.jpg` - Your product images
- `testimonial-*.jpg` - Customer photos
- `og-image.jpg` - Social media preview image

## 🎨 Styling Customization

### Colors
**File:** `assets/css/styles.css`

**CSS Variables (line ~15):**
```css
:root {
    --primary-color: #2563eb;     /* Your brand primary color */
    --primary-dark: #1d4ed8;      /* Darker version */
    --accent-color: #f59e0b;      /* Accent color */
    --text-primary: #1e293b;      /* Main text color */
    --text-secondary: #64748b;    /* Secondary text */
}
```

### Fonts
**File:** `assets/css/styles.css`

**Current font:** Inter (from Google Fonts)
**To change:** Update the Google Fonts import and font-family declarations

## 📧 Forms Configuration

### Contact Form
**File:** `assets/js/main.js`

**Replace the form submission logic with your backend endpoint:**
```javascript
// Current: console.log simulation
// Replace with: actual form submission to your server
```

**Options:**
- Connect to your backend API
- Use form services like Formspree, Netlify Forms, etc.
- Integrate with email services

### Newsletter
**File:** `assets/js/main.js`

**Replace with your email service integration:**
- Mailchimp
- ConvertKit  
- EmailJS
- Your custom API

## 🔒 Security Notes

### PayPal Security
- ✅ Use production client ID for live payments
- ✅ Never expose sandbox credentials in production
- ✅ Test with small amounts before going live
- ✅ Set up webhook endpoints for order processing

### Analytics Privacy
- Update privacy policy to reflect tracking
- Consider GDPR compliance for European users
- Provide opt-out options where required

## 📞 Support Checklist

Before launching:
- [ ] PayPal client ID updated to production
- [ ] All analytics tracking codes replaced
- [ ] Google Maps updated to your location
- [ ] Contact information updated
- [ ] Products updated with your inventory
- [ ] Images replaced with your content
- [ ] Colors customized to your brand
- [ ] Forms connected to your backend/service
- [ ] SSL certificate installed
- [ ] Domain name configured
- [ ] Test complete purchase flow
- [ ] Mobile responsiveness verified
- [ ] Page loading speed optimized

## 🚀 Going Live

### Final Steps:
1. Upload all files to your web server
2. Test PayPal payments with real small amounts
3. Verify all forms are working
4. Check Google Analytics is receiving data
5. Test mobile experience on actual devices
6. Monitor console for any JavaScript errors
7. Set up regular backups

### Performance Monitoring:
- Use Google PageSpeed Insights
- Monitor Core Web Vitals
- Check mobile usability in Google Search Console
- Track conversion rates in Google Analytics

---

**Need Help?** 
- Check the debugging functions in browser console
- Review the CHANGELOG.md for recent updates
- Ensure all required files are uploaded to server