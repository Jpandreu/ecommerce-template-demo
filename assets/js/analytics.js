/*
 * Analytics and Integrations Configuration
 * Professional Ecommerce Template
 * 
 * Copyright © 2025 Josep Andreu
 * License: Commercial use allowed - Do not redistribute
 */

// ====================================
// ANALYTICS CONFIGURATION
// ====================================

// Google Analytics 4 Configuration
const ANALYTICS_CONFIG = {
    // Replace with your Google Analytics 4 Measurement ID
    GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX',
    
    // Enhanced Ecommerce Events
    enableEcommerce: true,
    
    // Custom Events to Track
    customEvents: {
        productView: true,
        addToCart: true,
        removeFromCart: true,
        initiateCheckout: true,
        purchase: true,
        contactForm: true,
        newsletter: true
    }
};

// Facebook Pixel Configuration  
const FACEBOOK_CONFIG = {
    // Replace with your Facebook Pixel ID
    PIXEL_ID: 'XXXXXXXXXXXXXX',
    
    // Events to Track
    events: {
        pageView: true,
        viewContent: true,
        addToCart: true,
        initiateCheckout: true,
        purchase: true,
        lead: true
    }
};

// Google Tag Manager Configuration
const GTM_CONFIG = {
    // Replace with your GTM Container ID
    CONTAINER_ID: 'GTM-XXXXXXX'
};

// ====================================
// ANALYTICS FUNCTIONS
// ====================================

// Initialize Analytics
function initAnalytics() {
    if (ANALYTICS_CONFIG.GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        initGA4();
    }
    
    if (GTM_CONFIG.CONTAINER_ID !== 'GTM-XXXXXXX') {
        initGTM();
    }
    
    if (FACEBOOK_CONFIG.PIXEL_ID !== 'XXXXXXXXXXXXXX') {
        initFacebookPixel();
    }
}

// Initialize Google Analytics 4
function initGA4() {
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
        // Enhanced ecommerce
        send_page_view: true,
        // Privacy settings
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
    });
    
    window.gtag = gtag;
}

// Initialize Google Tag Manager
function initGTM() {
    // GTM script
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',GTM_CONFIG.CONTAINER_ID);
}

// Initialize Facebook Pixel
function initFacebookPixel() {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', FACEBOOK_CONFIG.PIXEL_ID);
    fbq('track', 'PageView');
    
    window.fbq = fbq;
}

// ====================================
// ECOMMERCE TRACKING FUNCTIONS
// ====================================

// Track Product View
function trackProductView(productData) {
    if (window.gtag && ANALYTICS_CONFIG.customEvents.productView) {
        gtag('event', 'view_item', {
            currency: 'USD',
            value: parseFloat(productData.price.replace('$', '')),
            items: [{
                item_id: productData.id,
                item_name: productData.name,
                category: productData.category,
                price: parseFloat(productData.price.replace('$', '')),
                quantity: 1
            }]
        });
    }
    
    if (window.fbq && FACEBOOK_CONFIG.events.viewContent) {
        fbq('track', 'ViewContent', {
            content_ids: [productData.id],
            content_name: productData.name,
            content_category: productData.category,
            value: parseFloat(productData.price.replace('$', '')),
            currency: 'USD'
        });
    }
}

// Track Add to Cart
function trackAddToCart(productData, quantity = 1) {
    if (window.gtag && ANALYTICS_CONFIG.customEvents.addToCart) {
        gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: parseFloat(productData.price.replace('$', '')) * quantity,
            items: [{
                item_id: productData.id,
                item_name: productData.name,
                category: productData.category,
                price: parseFloat(productData.price.replace('$', '')),
                quantity: quantity
            }]
        });
    }
    
    if (window.fbq && FACEBOOK_CONFIG.events.addToCart) {
        fbq('track', 'AddToCart', {
            content_ids: [productData.id],
            content_name: productData.name,
            value: parseFloat(productData.price.replace('$', '')) * quantity,
            currency: 'USD'
        });
    }
}

// Track Remove from Cart
function trackRemoveFromCart(productData, quantity = 1) {
    if (window.gtag && ANALYTICS_CONFIG.customEvents.removeFromCart) {
        gtag('event', 'remove_from_cart', {
            currency: 'USD',
            value: parseFloat(productData.price.replace('$', '')) * quantity,
            items: [{
                item_id: productData.id,
                item_name: productData.name,
                category: productData.category,
                price: parseFloat(productData.price.replace('$', '')),
                quantity: quantity
            }]
        });
    }
}

// Track Begin Checkout
function trackBeginCheckout(cartItems, totalValue) {
    if (window.gtag && ANALYTICS_CONFIG.customEvents.initiateCheckout) {
        gtag('event', 'begin_checkout', {
            currency: 'USD',
            value: totalValue,
            items: cartItems.map(item => ({
                item_id: item.id,
                item_name: item.name,
                category: item.category || 'Unknown',
                price: parseFloat(item.price.replace('$', '')),
                quantity: item.quantity
            }))
        });
    }
    
    if (window.fbq && FACEBOOK_CONFIG.events.initiateCheckout) {
        fbq('track', 'InitiateCheckout', {
            content_ids: cartItems.map(item => item.id),
            value: totalValue,
            currency: 'USD',
            num_items: cartItems.length
        });
    }
}

// Track Purchase
function trackPurchase(orderData) {
    if (window.gtag && ANALYTICS_CONFIG.customEvents.purchase) {
        gtag('event', 'purchase', {
            transaction_id: orderData.orderId,
            currency: 'USD',
            value: orderData.total,
            shipping: orderData.shipping || 0,
            tax: orderData.tax || 0,
            items: orderData.items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                category: item.category || 'Unknown',
                price: parseFloat(item.price.replace('$', '')),
                quantity: item.quantity
            }))
        });
    }
    
    if (window.fbq && FACEBOOK_CONFIG.events.purchase) {
        fbq('track', 'Purchase', {
            content_ids: orderData.items.map(item => item.id),
            value: orderData.total,
            currency: 'USD',
            num_items: orderData.items.length
        });
    }
}

// Track Contact Form Submission
function trackContactForm(formData) {
    if (window.gtag && ANALYTICS_CONFIG.customEvents.contactForm) {
        gtag('event', 'generate_lead', {
            currency: 'USD',
            value: 0 // Assign a value if you know the lead value
        });
    }
    
    if (window.fbq && FACEBOOK_CONFIG.events.lead) {
        fbq('track', 'Lead', {
            content_name: 'Contact Form Submission'
        });
    }
}

// Track Newsletter Signup
function trackNewsletter(email) {
    if (window.gtag && ANALYTICS_CONFIG.customEvents.newsletter) {
        gtag('event', 'sign_up', {
            method: 'email'
        });
    }
    
    if (window.fbq && FACEBOOK_CONFIG.events.lead) {
        fbq('track', 'Lead', {
            content_name: 'Newsletter Signup'
        });
    }
}

// ====================================
// INITIALIZATION
// ====================================

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAnalytics();
});

// Export functions for use in other scripts
window.AnalyticsTracker = {
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackPurchase,
    trackContactForm,
    trackNewsletter
};