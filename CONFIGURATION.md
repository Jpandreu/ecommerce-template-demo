# ⚙️ CONFIGURATION GUIDE# 🔧 Configuration Guide



## Basic ConfigurationThis file contains all the settings you need to customize for your ecommerce store.



### 1. Site Branding## 📍 Required Configurations

**File**: `assets/css/styles.css`

```css### 0. Cross-Browser Compatibility (Already Configured)

/* Update your brand colors */The template includes comprehensive cross-browser support files that work automatically:

:root {

    --primary-color: #ff6b35;     /* Change to your brand color */**CSS Files (Already included):**

    --secondary-color: #2c3e50;   /* Change to your accent color */- `assets/css/styles.css` - Base styles

    --text-color: #333;           /* Main text color */- `assets/css/cross-browser.css` - Universal browser compatibility

}- `assets/css/safari-mobile-fixes.css` - Safari mobile optimizations

```

**JavaScript Files (Already included):**

### 2. Logo Replacement- `assets/js/main.js` - Core functionality with mobile fixes

- Replace `assets/images/logo.svg` with your logo- `assets/js/polyfills.js` - Cross-browser JavaScript support

- Replace `assets/images/logo-white.svg` with white version

- Update favicon: Replace `assets/images/favicon.ico`**Supported Browsers:**

- ✅ Chrome 60+ (Full support)

### 3. Contact Information- ✅ Firefox 60+ (Full support)  

**Files to update**:- ✅ Safari 12+ (Full support with mobile optimizations)

- `index.html` - Footer contact section- ✅ Opera 50+ (Full support)

- `services.html` - Contact form and map- ✅ Microsoft Edge 79+ (Full support)

- All pages - Phone and email in header- ✅ iOS Safari (Specially optimized)



## PayPal Integration**No additional configuration needed** - These files work automatically!



### Step 1: Get PayPal Credentials### 1. PayPal Settings

1. Go to [PayPal Developer](https://developer.paypal.com)**File:** `checkout.html` (line ~497)

2. Create a new app

3. Get your **Client ID** and **Client Secret****Current (Testing):**

```html

### Step 2: Configure PayPal<script src="https://www.paypal.com/sdk/js?client-id=AZ9iJD_rQThbLgbXhsW0XDx1sJbAKjiL6wf8C5YGV0vcF7K2hXniErnzw3MQaw8zuEw4Jh7_5q6E7Tmu&currency=USD&disable-funding=credit,card"></script>

**File**: `assets/js/checkout.js````

```javascript

// Line ~15 - Update PayPal configuration**For Production:**

paypal.Buttons({```html

    createOrder: function(data, actions) {<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PRODUCTION_CLIENT_ID&currency=USD&disable-funding=credit,card"></script>

        return actions.order.create({```

            purchase_units: [{

                amount: {**How to get your PayPal Client ID:**

                    value: cartTotal.toFixed(2),1. Create PayPal Business account: https://www.paypal.com/business

                    currency_code: 'USD'  // Change currency if needed2. Go to PayPal Developer Dashboard: https://developer.paypal.com/

                }3. Create new app and get your client ID

            }]4. Replace `YOUR_PRODUCTION_CLIENT_ID` with your actual client ID

        });

    },### 2. Google Analytics 4

    // Add your PayPal Client ID in checkout.html**File:** `checkout.html` and other pages

})

```**Replace:**

```html

### Step 3: Update PayPal Script<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

**File**: `checkout.html`<script>

```html  window.dataLayer = window.dataLayer || [];

<!-- Line ~45 - Update with your Client ID -->  function gtag(){dataLayer.push(arguments);}

<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>  gtag('js', new Date());

```  gtag('config', 'G-XXXXXXXXXX');

</script>

## Product Management```



### Adding Products**With your GA4 tracking ID**

**File**: `assets/js/products.js`

```javascript### 3. Facebook Pixel

// Add to products array (line ~1)**File:** Various pages

{

    id: 13,**Replace:**

    name: "Your Product Name",```html

    price: 99.99,<script>

    image: "assets/images/your-product.jpg",  fbq('init', 'YOUR_PIXEL_ID');

    category: "category-name",  fbq('track', 'PageView');

    description: "Product description here",</script>

    specifications: {```

        "Material": "Cotton blend",

        "Size": "Available in S, M, L, XL",### 4. Google Tag Manager

        "Care": "Machine washable"**File:** Various pages

    }

}**Replace:**

``````html

<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':

### Product Imagesnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],

1. Add product images to `assets/images/`j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=

2. Recommended size: 800x800px'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);

3. Format: JPG or WebP for best performance})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

4. Update image path in products.js```



## Analytics & Tracking### 5. Google Maps

**File:** `index.html` (contact section)

### Google Analytics 4

**File**: `assets/js/analytics.js`**Replace the iframe src with your location:**

```javascript```html

// Line ~1 - Update with your GA4 ID<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.682...YOUR_EMBED_URL"

gtag('config', 'GA_MEASUREMENT_ID', {```

    page_title: document.title,

    page_location: window.location.href**How to get embed URL:**

});1. Go to Google Maps

```2. Search your business address

3. Click Share > Embed a map

### Facebook Pixel4. Copy the URL and replace in iframe src

**File**: `assets/js/analytics.js`

```javascript## 📝 Content Customization

// Line ~20 - Update with your Pixel ID

fbq('init', 'YOUR_PIXEL_ID');### Business Information

```**Files to update:**



## Advanced Customization**Contact Information (`index.html`, `services.html`, footer sections):**

- Address: Replace with your business address

### Color Scheme- Phone: Replace with your business phone

Update CSS variables in `assets/css/styles.css`:- Email: Replace with your business email

```css- Hours: Update business hours

:root {

    --primary-color: #your-color;**Company Details:**

    --secondary-color: #your-color;- Business name in headers and titles

    --accent-color: #your-color;- About us text in hero sections

    --background-color: #your-color;- Service descriptions in `services.html`

    --text-color: #your-color;

}### Products

```**File:** `assets/js/products.js`



### Typography**Update the products array with your inventory:**

Change fonts by updating the Google Fonts import and CSS:```javascript

```cssconst products = [

@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600;700&display=swap');    {

        id: 1,

body {        name: "Your Product Name",

    font-family: 'YourFont', sans-serif;        price: "$49.99",

}        originalPrice: "$69.99", // Optional

```        image: "assets/images/your-product.jpg",

        category: "electronics", // or your category

### Mobile Optimization        rating: 4.5,

All mobile optimizations are included automatically:        reviews: 127,

- Responsive breakpoints: 768px, 480px, 360px        isNew: false,

- Touch-friendly buttons (44px minimum)        isOffer: true,

- Mobile-specific CSS animations        description: "Your product description...",

- iOS Safari fixes included        features: ["Feature 1", "Feature 2", "Feature 3"],

        colors: ["#000000", "#ffffff"], // Optional

## Deployment        sizes: ["S", "M", "L"], // Optional

        stock: 50

### Hosting Requirements    }

- **Web Server**: Apache or Nginx    // Add more products...

- **PHP**: Not required (static HTML)];

- **SSL Certificate**: Recommended for PayPal```

- **HTTPS**: Required for payment processing

### Images

### Upload Instructions**Replace files in `assets/images/`:**

1. Upload all files to your domain root- `logo.svg` - Your business logo

2. Ensure file permissions are correct (644 for files, 755 for folders)- `logo-white.svg` - White version of logo

3. Test all pages and functionality- `hero-bg.jpg` - Main hero background

4. Configure SSL certificate- `product-*.jpg` - Your product images

5. Update PayPal to live credentials- `testimonial-*.jpg` - Customer photos

- `og-image.jpg` - Social media preview image

## Troubleshooting

## 🎨 Styling Customization

### Common Issues

- **PayPal not working**: Check Client ID and sandbox/live mode### Colors

- **Images not loading**: Verify file paths and permissions**File:** `assets/css/styles.css`

- **Mobile issues**: Clear browser cache and test on actual devices

- **Cart not persisting**: Enable cookies in browser settings**CSS Variables (line ~15):**

```css

### Performance Tips:root {

- Enable GZIP compression on your server    --primary-color: #2563eb;     /* Your brand primary color */

- Use a CDN for faster image loading    --primary-dark: #1d4ed8;      /* Darker version */

- Optimize images before uploading    --accent-color: #f59e0b;      /* Accent color */

- Enable browser caching with .htaccess rules    --text-primary: #1e293b;      /* Main text color */
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