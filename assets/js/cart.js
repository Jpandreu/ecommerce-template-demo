// Cart Management JavaScript

// Function to handle images without flickering
function preloadImage(src, fallbackSrc = './assets/images/placeholder.jpg') {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(fallbackSrc);
        img.src = src;
    });
}

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.debounceTimer = null;
        this.init();
    }
    
    // Helper function to convert price strings to numbers
    parsePrice(price) {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            return parseFloat(price.replace('$', '').replace(',', ''));
        }
        return 0;
    }

    init() {
        this.updateCartItemsData(); // Update existing items with latest translations
        this.renderCart();
        this.attachMainEventListeners();
        this.updateCartCount();
        this.loadRecommendedProducts();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('shopping-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('shopping-cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Add item to cart
    addToCart(productId, quantity = 1) {
        console.log(`CartManager.addToCart called with: productId=${productId}, quantity=${quantity}`);
        
        // Prevent rapid successive calls for the same product
        const callKey = `addToCart_${productId}`;
        const now = Date.now();
        if (this.lastCalls && this.lastCalls[callKey] && (now - this.lastCalls[callKey]) < 1000) {
            console.log('Preventing duplicate addToCart call');
            return;
        }
        
        if (!this.lastCalls) this.lastCalls = {};
        this.lastCalls[callKey] = now;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            console.log(`Updated existing item. New quantity: ${existingItem.quantity}`);
        } else {
            const productData = this.getProductData(productId);
            if (productData) {
                // Convert price strings to numbers
                const itemData = {
                    id: productId,
                    ...productData,
                    price: this.parsePrice(productData.price),
                    originalPrice: productData.originalPrice ? this.parsePrice(productData.originalPrice) : null,
                    quantity: quantity
                };
                this.cart.push(itemData);
                console.log(`Added new item to cart:`, itemData);
            }
        }
        
        this.saveCart();
        this.renderCart();
        this.showMessage('Product added to cart', 'success');
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        this.showMessage('Product removed from cart', 'info');
    }

    // Update item quantity with debounce to prevent flickering
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            
            // Clear previous timer
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            
            // Update immediately for responsive UI
            this.updateCartItemDisplay(productId);
            
            // Debounce save and summary update
            this.debounceTimer = setTimeout(() => {
                this.saveCart();
                this.renderSummary();
            }, 100);
        } else if (newQuantity === 0) {
            this.removeFromCart(productId);
        }
    }

    // Update only a specific cart item display (to prevent full re-render)
    updateCartItemDisplay(productId) {
        const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
        const item = this.cart.find(item => item.id === productId);
        
        if (cartItem && item) {
            // Update quantity input
            const quantityInput = cartItem.querySelector('.quantity-input');
            if (quantityInput) {
                quantityInput.value = item.quantity;
            }
            
            // Update quantity buttons state
            const decreaseBtn = cartItem.querySelector('.decrease-btn');
            if (decreaseBtn) {
                decreaseBtn.disabled = item.quantity <= 1;
            }
        }
    }

    // Get product data (would typically come from an API)
    getProductData(productId) {
        const products = {
            '1': {
                name: 'Smartphone Premium Pro Max',
                price: 299.99,
                originalPrice: 399.99,
                category: 'Electronics',
                image: './assets/images/product1.jpg',
                features: 'Latest model with advanced technology'
            },
            '2': {
                name: 'Elegant Premium Jacket',
                price: 89.99,
                category: 'Fashion',
                image: './assets/images/product2.jpg',
                features: 'Modern design and premium materials'
            },
            '3': {
                name: 'Modern Design Lamp',
                price: 149.99,
                originalPrice: 214.99,
                category: 'Home',
                image: './assets/images/product3.jpg',
                features: 'Contemporary design and LED technology'
            },
            '4': {
                name: 'Wireless Pro Headphones',
                price: 199.99,
                category: 'Electronics',
                image: './assets/images/product4.jpg',
                features: 'Active noise cancellation'
            },
            '5': {
                name: 'Pro Running Shoes',
                price: 79.99,
                category: 'Sports',
                image: './assets/images/product5.jpg',
                features: 'Advanced cushioning technology'
            },
            '6': {
                name: 'Premium Classic Watch',
                price: 129.99,
                category: 'Fashion',
                image: './assets/images/product6.jpg',
                features: 'Swiss precision mechanism'
            },
            '7': {
                name: 'Luxury Decorative Cushion',
                price: 89.99,
                category: 'Home',
                image: './assets/images/product7.jpg',
                features: 'Premium velvet with hypoallergenic filling'
            },
            '8': {
                name: 'Ultra Professional Tablet',
                price: 449.99,
                category: 'Electronics',
                image: './assets/images/product8.jpg',
                features: '4K display and latest generation processor'
            },
            '9': {
                name: 'Handcrafted Leather Bag',
                price: 179.99,
                category: 'Fashion',
                image: './assets/images/product9.jpg',
                features: 'Genuine handmade leather'
            },
            '10': {
                name: 'ProTech Sports Helmet',
                price: 159.99,
                category: 'Sports',
                image: './assets/images/product10.jpg',
                features: 'Advanced ventilation technology'
            },
            '11': {
                name: 'Smart Robot Vacuum',
                price: 299.99,
                originalPrice: 374.99,
                category: 'Home',
                image: './assets/images/product11.jpg',
                features: 'Laser mapping and app control'
            },
            '12': {
                name: 'Portable Bluetooth Speaker',
                price: 89.99,
                category: 'Electronics',
                image: './assets/images/product12.jpg',
                features: '360° sound and 24-hour battery'
            }
        };
        
        return products[productId] || null;
    }

    // Calculate totals
    calculateTotals() {
        const subtotal = this.cart.reduce((total, item) => {
            const price = this.parsePrice(item.price);
            return total + (price * item.quantity);
        }, 0);
        const shipping = subtotal > 100 ? 0 : 9.99;
        const tax = subtotal * 0.21; // 21% VAT
        const total = subtotal + shipping + tax;

        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
    }

    // Render cart items
    renderCart() {
        const cartItemsList = document.getElementById('cartItemsList');
        const cartSummary = document.getElementById('cartSummary');
        const emptyCart = document.getElementById('emptyCart');

        if (this.cart.length === 0) {
            if (cartItemsList) cartItemsList.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        if (cartItemsList) cartItemsList.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';

        // Render cart items
        if (cartItemsList) {
            cartItemsList.innerHTML = this.cart.map(item => this.renderCartItem(item)).join('');
            // Add event listeners only if not already attached
            this.attachCartItemListeners();
        }

        // Render summary
        this.renderSummary();
    }

    // Render individual cart item
    renderCartItem(item) {
        const price = this.parsePrice(item.price);
        const originalPrice = item.originalPrice ? this.parsePrice(item.originalPrice) : null;
        const originalPriceHtml = originalPrice ? 
            `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : '';
        
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image product-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='./assets/images/placeholder.jpg'">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="item-category">${item.category}</div>
                    <div class="item-features">${item.features}</div>
                </div>
                <div class="item-price">
                    $${price.toFixed(2)}
                    ${originalPriceHtml}
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-btn" data-product-id="${item.id}" 
                            ${item.quantity <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                           data-product-id="${item.id}">
                    <button class="quantity-btn increase-btn" data-product-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item" data-product-id="${item.id}" 
                        title="Remove product">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    // Render cart summary
    renderSummary() {
        const totals = this.calculateTotals();
        const summaryContent = document.getElementById('summaryContent');
        
        if (!summaryContent) return;

        summaryContent.innerHTML = `
            <div class="summary-row">
                <span>Subtotal (${this.cart.length} ${this.cart.length === 1 ? 'item' : 'items'})</span>
                <span>$${totals.subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${totals.shipping === '0.00' ? 'Free' : '$' + totals.shipping}</span>
            </div>
            <div class="summary-row">
                <span>VAT (21%)</span>
                <span>$${totals.tax}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>$${totals.total}</span>
            </div>
        `;
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            
            // Update count text and data attribute
            cartCount.textContent = totalItems;
            cartCount.setAttribute('data-count', totalItems);
            
            // Show/hide badge based on count
            if (totalItems > 0) {
                cartCount.style.display = 'flex';
                
                // Add animation when count changes
                cartCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartCount.style.transform = 'scale(1)';
                }, 200);
                
                // Add active class to cart button for pulse effect
                const cartBtn = cartCount.closest('.cart-btn');
                if (cartBtn && window.location.pathname.includes('cart.html')) {
                    cartBtn.classList.add('active');
                }
            } else {
                cartCount.style.display = 'none';
                
                // Remove active class
                const cartBtn = cartCount.closest('.cart-btn');
                if (cartBtn) {
                    cartBtn.classList.remove('active');
                }
            }
        }
    }

    // Apply coupon code
    applyCoupon(code) {
        const validCoupons = {
            'WELCOME10': 0.1,
            'SAVE20': 0.2,
            'FREESHIP': 'free-shipping'
        };

        if (validCoupons[code.toUpperCase()]) {
            this.showMessage('Coupon applied successfully', 'success');
            // Here you would apply the discount logic
            return true;
        } else {
            this.showMessage('Invalid coupon', 'error');
            return false;
        }
    }

    // Load recommended products
    loadRecommendedProducts() {
        const recommendedContainer = document.getElementById('recommendedProducts');
        if (!recommendedContainer) return;

        // Sample recommended products (would come from API)
        const recommended = [
            { id: '1', name: 'Smartphone Premium Pro Max', price: 299.99, image: './assets/images/product1.jpg' },
            { id: '4', name: 'Wireless Pro Headphones', price: 199.99, image: './assets/images/product4.jpg' },
            { id: '8', name: 'Ultra Professional Tablet', price: 449.99, image: './assets/images/product8.jpg' }
        ];

        recommendedContainer.innerHTML = recommended.map(product => `
            <div class="recommended-item">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='./assets/images/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-price">$${product.price}</div>
                    <button class="btn btn-primary" onclick="window.cartManager.addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Show messages to user
    showMessage(text, type = 'info') {
        // Create message element
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${text}
        `;

        // Add to page
        const container = document.querySelector('.cart-content .container');
        if (container) {
            container.insertBefore(message, container.firstChild);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 3000);
        }
    }

    // Clear entire cart
    clearCart() {
        if (confirm('Are you sure you want to empty the cart?')) {
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.showMessage('Cart emptied', 'info');
        }
    }

    // Utility function to clear cart and force refresh (for development/translation updates)
    static clearCartCache() {
        localStorage.removeItem('shopping-cart');
        console.log('Cart cache cleared. Please refresh the page to see updated translations.');
    }
    
    // Force update all cart data
    static forceCartUpdate() {
        const cartData = localStorage.getItem('shopping-cart');
        if (cartData) {
            const cart = JSON.parse(cartData);
            const cartManager = new CartManager();
            
            // Clear and re-add all items to get fresh data
            localStorage.removeItem('shopping-cart');
            cart.forEach(item => {
                cartManager.addToCart(item.id, item.quantity);
            });
            
            console.log('Cart data updated with latest translations.');
            window.location.reload();
        }
    }

    // Attach event listeners
    attachMainEventListeners() {
        // Coupon form
        const couponForm = document.getElementById('couponForm');
        if (couponForm && !couponForm.hasAttribute('data-listener-attached')) {
            couponForm.setAttribute('data-listener-attached', 'true');
            couponForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const couponInput = document.getElementById('couponCode');
                if (couponInput) {
                    this.applyCoupon(couponInput.value.trim());
                }
            });
        }

        // Clear cart button
        const clearCartBtn = document.getElementById('clearCart');
        if (clearCartBtn && !clearCartBtn.hasAttribute('data-listener-attached')) {
            clearCartBtn.setAttribute('data-listener-attached', 'true');
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn && !checkoutBtn.hasAttribute('data-listener-attached')) {
            checkoutBtn.setAttribute('data-listener-attached', 'true');
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showMessage('Your cart is empty', 'error');
                    return;
                }
                // Redirect to checkout page (to be created)
                window.location.href = 'checkout.html';
            });
        }

        // Continue shopping button
        const continueShoppingBtn = document.getElementById('continueShopping');
        if (continueShoppingBtn && !continueShoppingBtn.hasAttribute('data-listener-attached')) {
            continueShoppingBtn.setAttribute('data-listener-attached', 'true');
            continueShoppingBtn.addEventListener('click', () => {
                window.location.href = 'products.html';
            });
        }

        // Attach event listeners to cart controls using event delegation
        this.attachCartItemListeners();
    }

    // Remove existing cart item event listeners to prevent duplicates
    removeCartItemListeners() {
        // Remove existing delegated listeners by cloning the container
        const cartItemsList = document.getElementById('cartItemsList');
        if (cartItemsList && cartItemsList.hasAttribute('data-listeners-attached')) {
            cartItemsList.removeAttribute('data-listeners-attached');
        }
    }

    // Attach cart item event listeners using event delegation (prevents duplicates)
    attachCartItemListeners() {
        const cartItemsList = document.getElementById('cartItemsList');
        if (!cartItemsList || cartItemsList.hasAttribute('data-listeners-attached')) {
            return; // Already attached or element doesn't exist
        }

        // Mark that listeners are attached
        cartItemsList.setAttribute('data-listeners-attached', 'true');

        // Use event delegation for cart item controls
        cartItemsList.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const productId = target.dataset.productId;
            if (!productId) return;

            // Handle decrease button
            if (target.classList.contains('decrease-btn')) {
                const currentItem = this.cart.find(item => item.id === productId);
                if (currentItem && currentItem.quantity > 1) {
                    this.updateQuantity(productId, currentItem.quantity - 1);
                }
            }
            // Handle increase button
            else if (target.classList.contains('increase-btn')) {
                const currentItem = this.cart.find(item => item.id === productId);
                if (currentItem) {
                    this.updateQuantity(productId, currentItem.quantity + 1);
                }
            }
            // Handle remove button
            else if (target.classList.contains('remove-item')) {
                this.removeFromCart(productId);
            }
        });

        // Handle quantity input changes
        cartItemsList.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const productId = e.target.dataset.productId;
                const newQuantity = parseInt(e.target.value);
                if (productId && newQuantity > 0) {
                    this.updateQuantity(productId, newQuantity);
                } else if (newQuantity === 0) {
                    this.removeFromCart(productId);
                }
            }
        });
    }

    // Update existing cart items with latest product data (for translation updates and price conversion)
    updateCartItemsData() {
        let hasUpdates = false;
        this.cart = this.cart.map(item => {
            const latestData = this.getProductData(item.id);
            let updatedItem = { ...item };
            
            // Convert string prices to numbers if needed
            if (typeof item.price === 'string') {
                updatedItem.price = this.parsePrice(item.price);
                hasUpdates = true;
            }
            
            if (item.originalPrice && typeof item.originalPrice === 'string') {
                updatedItem.originalPrice = this.parsePrice(item.originalPrice);
                hasUpdates = true;
            }
            
            if (latestData) {
                // Check if translation update is needed
                if (item.category !== latestData.category || 
                    item.features !== latestData.features ||
                    item.name !== latestData.name) {
                    hasUpdates = true;
                    updatedItem = {
                        ...updatedItem,
                        category: latestData.category,
                        features: latestData.features,
                        name: latestData.name
                    };
                }
            }
            return updatedItem;
        });
        
        if (hasUpdates) {
            this.saveCart();
            this.renderCart();
        }
    }

    // Get cart item count
    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart total
    getCartTotal() {
        return this.calculateTotals().total;
    }

    // Initialize lazy loading for dynamically added images
    initializeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]:not(.observed)');
        
        if (window.imageLoader && window.imageLoader.observer) {
            // Observe new lazy images
            lazyImages.forEach(img => {
                window.imageLoader.observer.observe(img);
                img.classList.add('observed');
            });
        } else {
            // Fallback if imageLoader is not available
            document.querySelectorAll('img[data-src]').forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                    img.onerror = () => {
                        img.src = './assets/images/placeholder.jpg';
                        img.classList.add('loaded', 'error');
                    };
                }
            });
        }
    }
}

// Initialize cart manager when DOM is loaded
// Initialize cart manager when DOM is loaded
function initializeCartManager() {
    if (!window.cartManager) {
        const cartManager = new CartManager();
        window.cartManager = cartManager;
        console.log('CartManager initialized successfully');
        return cartManager;
    }
    return window.cartManager;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing CartManager...');
    
    // Initialize CartManager
    initializeCartManager();
    
    // Initialize AOS animations if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// Export for use in other files
if (typeof window !== 'undefined') {
    window.CartManager = CartManager;
    window.initializeCartManager = initializeCartManager;
}

// Make utility functions available globally for development
window.CartUtils = {
    clearCache: CartManager.clearCartCache,
    forceUpdate: CartManager.forceCartUpdate
};

