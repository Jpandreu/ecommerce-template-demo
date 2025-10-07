// Universal Cart Fix - Works on all pages
(function() {
    'use strict';
    
    console.log('🛒 Universal Cart Fix initializing...');
    console.log('📍 Location:', window.location.pathname);
    console.log('📦 Available systems:', {
        CartManager: !!window.CartManager,
        cartManager: !!window.cartManager,
        updateGlobalCartCount: !!window.updateGlobalCartCount,
        triggerCartUpdate: !!window.triggerCartUpdate
    });
    
    // Enhanced Add to Cart function
    function initUniversalCart() {
        // Find all product containers (both product-card and product-item)
        const allProductContainers = document.querySelectorAll('.product-card, .product-item');
        console.log(`Found ${allProductContainers.length} product containers`);
        
        allProductContainers.forEach((container, index) => {
            console.log(`🔧 Setting up product container ${index + 1}:`, container);
            setupProductContainer(container, index + 1);
        });
        
        // Setup add-to-cart buttons specifically
        const addToCartButtons = document.querySelectorAll('.add-to-cart, .btn-primary');
        console.log(`Found ${addToCartButtons.length} potential cart buttons`);
        
        addToCartButtons.forEach(button => {
            if (button.textContent.toLowerCase().includes('cart') || button.textContent.toLowerCase().includes('add')) {
                setupAddToCartButton(button);
            }
        });
    }
    
    function setupProductContainer(container, fallbackId) {
        // Ensure container has data-id
        if (!container.hasAttribute('data-id')) {
            // Try to get ID from various sources
            let productId = getProductId(container, fallbackId);
            container.setAttribute('data-id', productId);
            console.log(`Assigned ID ${productId} to product container`);
        }
        
        // Find add to cart button within container
        let addButton = container.querySelector('.add-to-cart') || 
                       container.querySelector('.btn-primary[data-product-id]') ||
                       container.querySelector('.btn-primary');
        
        if (addButton && addButton.textContent.toLowerCase().includes('cart')) {
            setupAddToCartButton(addButton, container);
        }
    }
    
    function setupAddToCartButton(button, container = null) {
        // Skip if already setup
        if (button.hasAttribute('data-cart-setup')) return;
        button.setAttribute('data-cart-setup', 'true');
        
        // Ensure button has add-to-cart class
        button.classList.add('add-to-cart');
        
        // Get or set product ID
        let productId = button.getAttribute('data-product-id');
        if (!productId) {
            if (container) {
                productId = container.getAttribute('data-id');
            } else {
                // Try to find parent container
                container = button.closest('.product-card, .product-item');
                if (container) {
                    productId = container.getAttribute('data-id');
                }
            }
            
            if (productId) {
                button.setAttribute('data-product-id', productId);
            } else {
                // Generate fallback ID
                productId = 'product-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                button.setAttribute('data-product-id', productId);
                if (container) {
                    container.setAttribute('data-id', productId);
                }
            }
        }
        
        console.log(`Setup button for product ID: ${productId}`);
        
        // Remove any existing listeners to prevent duplicates
        button.removeEventListener('click', handleCartClick);
        button.addEventListener('click', handleCartClick);
    }
    
    function getProductId(container, fallbackId) {
        // Try multiple sources for product ID
        let productId = container.getAttribute('data-id') ||
                       container.getAttribute('data-product-id') ||
                       (container.querySelector('[data-product-id]') ? 
                        container.querySelector('[data-product-id]').getAttribute('data-product-id') : null) ||
                       (container.querySelector('.add-to-cart') ?
                        container.querySelector('.add-to-cart').getAttribute('data-product-id') : null);
        
        if (!productId) {
            // Try to extract from image alt or product name
            const img = container.querySelector('img');
            const productName = container.querySelector('.product-name, h3');
            
            if (img && img.alt) {
                productId = img.alt.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            } else if (productName) {
                productId = productName.textContent.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            } else {
                productId = fallbackId;
            }
        }
        
        return productId;
    }
    
    function handleCartClick(e) {
        e.preventDefault();
        
        const button = e.currentTarget;
        
        // Prevent multiple rapid clicks
        if (button.disabled) return;
        button.disabled = true;
        
        const productId = button.getAttribute('data-product-id');
        console.log(`🛒 Adding product ${productId} to cart`);
        
        // Store original button content
        const originalContent = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        button.style.pointerEvents = 'none';
        
        // Get product info
        const container = button.closest('.product-card, .product-item');
        const productInfo = extractProductInfo(container, productId);
        
        // Add to cart using available methods
        let success = false;
        
        // Method 1: Use CartManager if available (preferred)
        if (window.cartManager && typeof window.cartManager.addToCart === 'function') {
            console.log('Using CartManager.addToCart');
            try {
                window.cartManager.addToCart(productId, 1);
                success = true;
            } catch (error) {
                console.error('CartManager error:', error);
            }
        }
        
        // Method 2: Use existing CartManager class directly
        if (!success && window.CartManager) {
            console.log('Creating new CartManager instance');
            try {
                if (!window.cartManagerInstance) {
                    window.cartManagerInstance = new window.CartManager();
                }
                window.cartManagerInstance.addToCart(productId, 1);
                success = true;
            } catch (error) {
                console.error('CartManager instance error:', error);
            }
        }
        
        // Method 3: Use localStorage with same key as existing system
        if (!success) {
            console.log('Using localStorage with shopping-cart key');
            addToCartFallback(productId, productInfo);
            success = true;
        }
        
        // Show success state
        setTimeout(() => {
            if (success) {
                button.innerHTML = '<i class="fas fa-check"></i> Added!';
                button.style.background = '#10b981';
                
                // Show notification if available
                if (window.showNotification) {
                    window.showNotification(`${productInfo.name || 'Product'} added to cart!`, 'success');
                } else {
                    console.log(`✅ ${productInfo.name || 'Product'} added to cart successfully!`);
                }
                
                // Update cart count if element exists
                updateCartCount();
            } else {
                button.innerHTML = '<i class="fas fa-exclamation"></i> Error';
                button.style.background = '#ef4444';
            }
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.background = '';
                button.style.pointerEvents = '';
                button.disabled = false;
            }, 2000);
        }, 500);
    }
    
    function extractProductInfo(container, productId) {
        if (!container) return { id: productId };
        
        const name = container.querySelector('.product-name, h3, .product-title');
        const priceElement = container.querySelector('.price-current, .product-price, .price');
        const price = priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) : 0;
        const image = container.querySelector('img');
        
        return {
            id: productId,
            name: name ? name.textContent.trim() : `Product ${productId}`,
            price: price || 0,
            image: image ? image.src : '',
            quantity: 1
        };
    }
    
    function addToCartFallback(productId, productInfo) {
        try {
            // Use same localStorage key as existing CartManager
            let cart = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
            
            // Check if product already exists
            const existingIndex = cart.findIndex(item => item.id === productId);
            
            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push(productInfo);
            }
            
            localStorage.setItem('shopping-cart', JSON.stringify(cart));
            
            // Trigger cart update event for synchronization
            if (window.triggerCartUpdate) {
                window.triggerCartUpdate();
            }
            
            console.log('Product saved to shopping-cart localStorage');
        } catch (error) {
            console.error('localStorage cart error:', error);
        }
    }
    
    function updateCartCount() {
        try {
            // Use same localStorage key as existing system
            const cart = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
            const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
            
            // Update cart count elements
            const cartCountElements = document.querySelectorAll('.cart-count, .cart-badge, [data-cart-count]');
            cartCountElements.forEach(element => {
                element.textContent = count;
                element.style.display = count > 0 ? 'flex' : 'none';
            });
            
            // Use existing global function if available
            if (window.updateGlobalCartCount) {
                window.updateGlobalCartCount();
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }
    
    // Initialize when DOM is ready and CartManager is available
    function init() {
        // Wait for CartManager to be available
        const waitForCartManager = () => {
            if (window.cartManager || window.CartManager) {
                console.log('🛒 CartManager detected, initializing Universal Cart Fix...');
                initUniversalCart();
                updateCartCount();
                console.log('🛒 Universal Cart Fix initialized successfully!');
            } else {
                console.log('⏳ Waiting for CartManager...');
                setTimeout(waitForCartManager, 100);
            }
        };
        
        waitForCartManager();
    }
    
    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Give a small delay to ensure other scripts have loaded
        setTimeout(init, 100);
    }
    
    // Re-run when new content is added (for dynamic content)
    const observer = new MutationObserver((mutations) => {
        let hasNewProducts = false;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    if (node.classList && (node.classList.contains('product-card') || node.classList.contains('product-item'))) {
                        hasNewProducts = true;
                    } else if (node.querySelector && (node.querySelector('.product-card') || node.querySelector('.product-item'))) {
                        hasNewProducts = true;
                    }
                }
            });
        });
        
        if (hasNewProducts) {
            setTimeout(initUniversalCart, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Debug function - can be called from console
    window.debugCart = function() {
        console.log('🔍 CART DEBUG INFO:');
        console.log('- CartManager available:', !!window.cartManager);
        console.log('- CartManager class:', !!window.CartManager);
        console.log('- Add to cart buttons:', document.querySelectorAll('.add-to-cart').length);
        console.log('- Product containers:', document.querySelectorAll('.product-card, .product-item').length);
        
        const cart = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        console.log('- Cart contents:', cart);
        console.log('- Cart items count:', cart.length);
        
        // Test adding a product
        console.log('🧪 Testing add to cart...');
        try {
            if (window.cartManager) {
                window.cartManager.addToCart('1', 1);
                console.log('✅ CartManager test successful');
            } else {
                console.log('❌ CartManager not available');
            }
        } catch (error) {
            console.log('❌ CartManager test failed:', error);
        }
    };
    
})();