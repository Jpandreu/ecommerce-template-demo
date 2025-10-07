// Mobile Direct Payment Interface
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile Direct Payment Interface initialized');

    // Check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Show mobile direct payment interface if on mobile
    function showMobileInterface() {
        if (isMobile()) {
            console.log('Mobile detected, showing direct payment interface');
            document.body.classList.add('mobile-payment-active');
        }
    }

    // Hide mobile interface and show desktop checkout
    function showDesktopInterface() {
        console.log('Desktop detected, showing normal checkout');
        document.body.classList.remove('mobile-payment-active');
    }

    // Handle PayPal button click
    function handlePayPalClick() {
        console.log('PayPal option selected');
        
        // Here you would integrate with actual PayPal SDK
        // For demo purposes, we'll show a message
        alert('PayPal payment would be processed here. This is a demo.');
        
        // Show cancel message temporarily
        const cancelMessage = document.querySelector('.payment-cancel-message');
        if (cancelMessage) {
            cancelMessage.style.display = 'block';
            setTimeout(() => {
                cancelMessage.style.display = 'none';
            }, 3000);
        }
    }

    // Handle Credit Card button click
    function handleCardClick() {
        console.log('Credit Card option selected');
        
        // Switch to desktop checkout for card details
        showDesktopInterface();
        
        // Scroll to payment method section
        setTimeout(() => {
            const paymentSection = document.querySelector('.payment-method-section');
            if (paymentSection) {
                paymentSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    // Populate mobile order summary
    function populateOrderSummary() {
        try {
            const cart = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
            const orderItems = document.getElementById('mobileOrderItems');
            const subtotalEl = document.getElementById('mobileSubtotal');
            const shippingEl = document.getElementById('mobileShipping');
            const taxEl = document.getElementById('mobileTax');
            const totalEl = document.getElementById('mobileTotal');

            if (!orderItems) return;

            // Clear existing items
            orderItems.innerHTML = '';

            let subtotal = 0;
            const shipping = 5.00;
            const taxRate = 0.1; // 10%

            if (cart.length === 0) {
                orderItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
                return;
            }

            // Add each cart item
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const itemHtml = `
                    <div class="summary-item">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-details">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
                        </div>
                        <div class="item-price">$${itemTotal.toFixed(2)}</div>
                    </div>
                `;
                orderItems.innerHTML += itemHtml;
            });

            const tax = subtotal * taxRate;
            const total = subtotal + shipping + tax;

            // Update totals
            if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
            if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

            console.log('Mobile order summary populated with', cart.length, 'items');
        } catch (error) {
            console.error('Error populating mobile order summary:', error);
        }
    }

    // Validate terms acceptance before payment
    function validateTerms() {
        const termsAccept = document.getElementById('mobileTermsAccept');
        if (termsAccept && !termsAccept.checked) {
            alert('Please accept the Terms & Conditions to proceed with payment.');
            return false;
        }
        return true;
    }

    // Add event listeners
    function initEventListeners() {
        const paypalButton = document.getElementById('directPaypalButton');
        const cardButton = document.getElementById('directCardButton');

        if (paypalButton) {
            paypalButton.addEventListener('click', function() {
                if (validateTerms()) {
                    handlePayPalClick();
                }
            });
        }

        if (cardButton) {
            cardButton.addEventListener('click', function() {
                if (validateTerms()) {
                    handleCardClick();
                }
            });
        }
    }

    // Handle window resize
    function handleResize() {
        if (isMobile()) {
            showMobileInterface();
        } else {
            showDesktopInterface();
        }
    }

    // Initialize
    function init() {
        initEventListeners();
        
        // Populate order summary
        populateOrderSummary();
        
        // Check screen size on load
        if (isMobile()) {
            showMobileInterface();
        } else {
            showDesktopInterface();
        }

        // Handle resize events
        window.addEventListener('resize', handleResize);

        // Listen for cart updates
        window.addEventListener('storage', function(e) {
            if (e.key === 'shopping-cart') {
                populateOrderSummary();
            }
        });
    }

    // Start the mobile payment interface
    init();
});

// Expose functions globally if needed
window.MobileDirectPayment = {
    showMobile: function() {
        const mobilePayment = document.getElementById('mobileDirectPayment');
        const checkoutContent = document.querySelector('.checkout-content');
        
        if (mobilePayment && checkoutContent) {
            mobilePayment.style.display = 'block';
            checkoutContent.style.display = 'none';
            document.body.classList.add('mobile-payment-active');
        }
    },
    
    showDesktop: function() {
        const mobilePayment = document.getElementById('mobileDirectPayment');
        const checkoutContent = document.querySelector('.checkout-content');
        
        if (mobilePayment && checkoutContent) {
            mobilePayment.style.display = 'none';
            checkoutContent.style.display = 'block';
            document.body.classList.remove('mobile-payment-active');
        }
    }
};