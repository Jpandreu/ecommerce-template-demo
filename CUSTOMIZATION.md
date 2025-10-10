# Customization Guide - Professional Ecommerce Template

## 🎨 Design Customization

### Color Scheme
The template uses CSS custom properties for easy color customization. Edit `assets/css/styles.css`:

```css
:root {
  /* Primary Brand Colors */
  --primary-color: #2563eb;      /* Main brand color */
  --primary-dark: #1d4ed8;       /* Darker shade for hover states */
  --primary-light: #3b82f6;      /* Lighter shade for backgrounds */
  
  /* Secondary Colors */
  --secondary-color: #64748b;     /* Secondary text and elements */
  --secondary-dark: #475569;      /* Darker secondary */
  --secondary-light: #94a3b8;     /* Lighter secondary */
  
  /* Accent Colors */
  --accent-color: #f59e0b;        /* Call-to-action elements */
  --success-color: #10b981;       /* Success messages */
  --warning-color: #f59e0b;       /* Warning messages */
  --error-color: #ef4444;         /* Error messages */
  
  /* Background Colors */
  --bg-primary: #ffffff;          /* Main background */
  --bg-secondary: #f8fafc;        /* Secondary background */
  --bg-dark: #1e293b;            /* Dark backgrounds */
  
  /* Text Colors */
  --text-primary: #1e293b;        /* Main text color */
  --text-secondary: #64748b;      /* Secondary text */
  --text-light: #94a3b8;         /* Light text */
}
```

### Typography
Change fonts by updating the Google Fonts import and CSS:

```css
/* In HTML head section */
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@300;400;500;600;700&display=swap" rel="stylesheet">

/* In CSS */
:root {
  --font-family: 'Your Font', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
}
```

### Logo Customization
1. Replace `assets/images/logo.svg` with your logo
2. Update the logo text in HTML:
```html
<div class="logo">
    <a href="#home">
        <img src="./assets/images/your-logo.svg" alt="Your Store Name">
        <span class="logo-text">Your Store Name</span>
    </a>
</div>
```

### Background Images
Replace hero background in CSS:
```css
.hero {
  background-image: url('../images/your-hero-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

## 📝 Content Customization

### Homepage Content
Edit `index.html` to update:

**Hero Section:**
```html
<section class="hero">
    <div class="hero-content">
        <h1>Your Store Headline</h1>
        <p>Your compelling store description</p>
        <a href="products.html" class="btn btn-primary">Shop Now</a>
    </div>
</section>
```

**Featured Products:**
Products are dynamically loaded from JavaScript. Edit `assets/js/main.js`:
```javascript
const featuredProducts = [
    {
        id: 1,
        name: "Your Product Name",
        image: "./assets/images/your-product.jpg",
        price: 99.99,
        originalPrice: 129.99,
        description: "Product description"
    }
    // Add more products...
];
```

### Product Management
Update product data in multiple files:

**Main Products (assets/js/main.js):**
```javascript
const products = {
    1: {
        name: "Product Name",
        image: "./assets/images/product1.jpg",
        description: "Detailed description",
        price: 99.99,
        originalPrice: 129.99,
        category: "electronics",
        inStock: true,
        features: [
            "Feature 1",
            "Feature 2",
            "Feature 3"
        ]
    }
};
```

**Quick View Modal (assets/js/quick-view-modal.js):**
```javascript
this.productData = {
    1: {
        name: "Product Name",
        image: "./assets/images/product1.jpg",
        description: "Modal description",
        currentPrice: 99.99,
        originalPrice: 129.99,
        features: ["Feature 1", "Feature 2"],
        specs: {
            "Dimension": "Value",
            "Weight": "Value"
        }
    }
};
```

### Navigation Menu
Update navigation links in all HTML files:
```html
<nav class="nav" id="nav">
    <ul class="nav-list">
        <li><a href="index.html" class="nav-link">Home</a></li>
        <li><a href="products.html" class="nav-link">Products</a></li>
        <li><a href="services.html" class="nav-link">Services</a></li>
        <li><a href="about.html" class="nav-link">About</a></li>
        <li><a href="contact.html" class="nav-link">Contact</a></li>
    </ul>
</nav>
```

## 🛒 Cart & Checkout Customization

### Currency Settings
Update currency in `assets/js/cart.js`:
```javascript
const CURRENCY = {
    symbol: '$',
    code: 'USD',
    position: 'before' // 'before' or 'after'
};

function formatPrice(price) {
    const formatted = price.toFixed(2);
    return CURRENCY.position === 'before' 
        ? `${CURRENCY.symbol}${formatted}`
        : `${formatted}${CURRENCY.symbol}`;
}
```

### Shipping Options
Configure shipping in `assets/js/checkout.js`:
```javascript
const shippingOptions = [
    {
        id: 'standard',
        name: 'Standard Shipping',
        price: 5.99,
        description: '5-7 business days'
    },
    {
        id: 'express',
        name: 'Express Shipping',
        price: 12.99,
        description: '2-3 business days'
    },
    {
        id: 'overnight',
        name: 'Overnight Shipping',
        price: 24.99,
        description: 'Next business day'
    }
];
```

### Tax Configuration
Set up tax calculation:
```javascript
const TAX_RATE = 0.08; // 8% tax rate
const TAX_REGIONS = {
    'CA': 0.08,  // California
    'NY': 0.085, // New York
    'TX': 0.06   // Texas
};
```

## 💳 Payment Customization

### PayPal Configuration
Update PayPal settings in `checkout.html`:
```javascript
paypal.Buttons({
    env: 'sandbox', // Change to 'production' for live
    client: {
        sandbox: 'YOUR_SANDBOX_CLIENT_ID',
        production: 'YOUR_LIVE_CLIENT_ID'
    },
    style: {
        color: 'blue',    // blue, gold, silver, white, black
        shape: 'rect',    // rect, pill
        size: 'medium',   // small, medium, large, responsive
        label: 'paypal'   // paypal, checkout, buynow, pay
    }
});
```

### Additional Payment Methods
Add more payment options:
```html
<!-- Add to checkout.html -->
<div class="payment-methods">
    <button class="payment-btn paypal-btn">
        <i class="fab fa-paypal"></i> PayPal
    </button>
    <button class="payment-btn stripe-btn">
        <i class="fab fa-stripe"></i> Stripe
    </button>
    <button class="payment-btn apple-pay-btn">
        <i class="fab fa-apple-pay"></i> Apple Pay
    </button>
</div>
```

## 📱 Mobile Customization

### Mobile Menu Colors
Customize mobile menu appearance:
```css
.navbar-collapse {
    background: rgba(0, 0, 0, 0.8) !important; /* Overlay color */
}

.mobile-nav-content {
    background: white !important; /* Menu background */
    width: 320px !important; /* Menu width */
}

.mobile-nav .nav-link {
    color: #1e293b !important; /* Link color */
    font-size: 1.1rem !important; /* Font size */
}

.mobile-nav .nav-link:hover {
    background: #f8fafc !important; /* Hover background */
}
```

### Mobile-Specific Styles
Add mobile-only customizations:
```css
@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem; /* Smaller heading on mobile */
    }
    
    .product-card {
        margin-bottom: 2rem; /* More spacing on mobile */
    }
    
    .btn {
        padding: 0.875rem 1.5rem; /* Larger buttons for touch */
        font-size: 1rem;
    }
}
```

## 🔧 Advanced Customization

### Adding New Pages
1. Create new HTML file (e.g., `about.html`)
2. Copy header and footer from existing page
3. Add to navigation menu
4. Update sitemap

### Custom JavaScript Features
Add new functionality:
```javascript
// Add to assets/js/main.js
function customFeature() {
    // Your custom code here
    console.log('Custom feature activated');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    customFeature();
});
```

### SEO Customization
Update meta tags for each page:
```html
<title>Your Page Title - Your Store Name</title>
<meta name="description" content="Your page description for search engines">
<meta name="keywords" content="keyword1, keyword2, keyword3">

<!-- Open Graph for social media -->
<meta property="og:title" content="Your Page Title">
<meta property="og:description" content="Your page description">
<meta property="og:image" content="./assets/images/og-image.jpg">
<meta property="og:type" content="website">
```

### Analytics Integration
Add Google Analytics:
```html
<!-- Add before closing </head> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 📋 Customization Checklist

### Design
- [ ] Colors updated to match brand
- [ ] Logo replaced and properly sized
- [ ] Typography customized
- [ ] Background images updated
- [ ] Mobile styles adjusted

### Content
- [ ] All text content updated
- [ ] Product information added
- [ ] Navigation menu customized
- [ ] Contact information updated
- [ ] Social media links added

### Functionality
- [ ] PayPal Client ID configured
- [ ] Currency settings updated
- [ ] Shipping options configured
- [ ] Tax settings adjusted
- [ ] Analytics tracking added

### Testing
- [ ] All customizations tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility checked
- [ ] Payment processing tested
- [ ] Forms functionality verified

---

**Your customized ecommerce template is ready to launch!** 🎉