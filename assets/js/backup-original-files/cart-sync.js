// Global cart counter synchronization
// This script ensures the cart count is always up to date across all pages

(function() {
    'use strict';
    
    // Function to update cart count display
    function updateGlobalCartCount() {
        const savedCart = localStorage.getItem('shopping-cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            // Update count text and data attribute
            cartCount.textContent = totalItems;
            cartCount.setAttribute('data-count', totalItems);
            
            // Show/hide badge based on count
            if (totalItems > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }
    
    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', function() {
        updateGlobalCartCount();
        
        // Listen for storage changes from other tabs/pages
        window.addEventListener('storage', function(e) {
            if (e.key === 'shopping-cart') {
                updateGlobalCartCount();
            }
        });
        
        // Listen for custom cart update events
        document.addEventListener('cartUpdated', function() {
            updateGlobalCartCount();
        });
    });
    
    // Expose function globally
    window.updateGlobalCartCount = updateGlobalCartCount;
    
    // Custom event to trigger cart updates
    window.triggerCartUpdate = function() {
        const event = new CustomEvent('cartUpdated');
        document.dispatchEvent(event);
    };
})();
