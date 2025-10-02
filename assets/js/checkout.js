// Checkout Management JavaScript

class CheckoutManager {
    constructor() {
        this.cart = this.loadCart();
        this.currentStep = 'payment';
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
        console.log('CheckoutManager initializing...', { cartLength: this.cart.length });
        this.renderOrderSummary();
        this.attachEventListeners();
        this.setupFormValidation();
        this.setupCardFormatting();
        this.setupRealTimeValidation();
        this.updateCartCount();
        
        // Initialize payment method display
        console.log('Initializing payment method display...');
        this.handlePaymentMethodChange();
        
        // Initialize PayPal after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initializePayPal();
        }, 500);
        
        console.log('CheckoutManager initialized successfully');
    }

    // Setup real-time validation for PayPal
    setupRealTimeValidation() {
        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode'];
        
        console.log('Setting up real-time validation for PayPal...');
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                console.log(`✅ Adding listeners to field: ${fieldId}`);
                
                // Add listeners for real-time validation
                const updatePayPal = () => {
                    console.log(`🔄 Field ${fieldId} changed, updating PayPal...`);
                    setTimeout(() => {
                        this.handlePaymentMethodChange();
                    }, 100);
                };
                
                field.addEventListener('input', updatePayPal);
                field.addEventListener('blur', updatePayPal);
                field.addEventListener('change', updatePayPal);
            } else {
                console.warn(`❌ Required field ${fieldId} not found in form`);
            }
        });
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('shopping-cart');
        console.log('Loading cart from localStorage:', savedCart);
        
        if (savedCart) {
            try {
                const cart = JSON.parse(savedCart);
                console.log('Parsed cart:', cart);
                return Array.isArray(cart) ? cart : [];
            } catch (error) {
                console.error('Error parsing cart data:', error);
                return [];
            }
        }
        
        return [];
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Render order summary
    renderOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        const summaryTotals = document.getElementById('summaryTotals');

        console.log('Rendering order summary...', { 
            orderItems: !!orderItems, 
            summaryTotals: !!summaryTotals, 
            cartLength: this.cart.length 
        });

        if (!orderItems || !summaryTotals) {
            console.error('Order summary elements not found');
            return;
        }

        // Ensure cart is array
        if (!Array.isArray(this.cart)) {
            console.error('Cart is not an array:', this.cart);
            this.cart = [];
        }

        // Check if cart is empty
        if (this.cart.length === 0) {
            orderItems.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart" style="font-size: 2rem; color: #64748b; margin-bottom: 1rem;"></i>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            summaryTotals.innerHTML = '';
            return;
        }

        // Render order items with error handling
        try {
            orderItems.innerHTML = this.cart.map(item => this.renderOrderItem(item)).join('');
        } catch (error) {
            console.error('Error rendering order items:', error);
            orderItems.innerHTML = '<div class="error-message">Error loading cart items</div>';
        }

        // Render totals
        const totals = this.calculateTotals();
        summaryTotals.innerHTML = `
            <div class="summary-row">
                <span>Subtotal (${this.cart.length} ${this.cart.length === 1 ? 'item' : 'items'})</span>
                <span>$${totals.subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${totals.shipping === '0.00' ? 'Free' : '$' + totals.shipping}</span>
            </div>
            <div class="summary-row">
                <span>Tax (21%)</span>
                <span>$${totals.tax}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>$${totals.total}</span>
            </div>
        `;
    }

    // Render individual order item
    renderOrderItem(item) {
        try {
            console.log('Rendering order item:', item);
            
            if (!item) {
                console.error('Invalid item data');
                return '<div class="order-item error">Invalid item</div>';
            }
            
            const price = this.parsePrice(item.price || 0);
            const originalPrice = item.originalPrice ? this.parsePrice(item.originalPrice) : null;
            const originalPriceHtml = originalPrice ? 
                `<span class="original-price">$${(originalPrice * (item.quantity || 1)).toFixed(2)}</span>` : '';
            
            const safeItem = {
                name: item.name || 'Unknown Product',
                quantity: item.quantity || 1,
                category: item.category || 'General',
                image: item.image || './assets/images/placeholder.jpg'
            };
            
            console.log('Item processed:', { price, originalPrice, quantity: safeItem.quantity });
        
            return `
                <div class="order-item">
                    <div class="order-item-image">
                        <img src="${safeItem.image}" alt="${safeItem.name}" onload="this.classList.add('loaded')" onerror="this.src='./assets/images/placeholder.jpg'; this.classList.add('loaded');">
                    </div>
                    <div class="order-item-info">
                        <div class="order-item-name">${safeItem.name}</div>
                        <div class="order-item-details">Quantity: ${safeItem.quantity} | ${safeItem.category}</div>
                        <div class="order-item-price">
                            $${(price * safeItem.quantity).toFixed(2)}
                            ${originalPriceHtml}
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering order item:', error, item);
            return '<div class="order-item error">Error loading item</div>';
        }
    }

    // Calculate totals
    calculateTotals() {
        try {
            if (!Array.isArray(this.cart) || this.cart.length === 0) {
                return {
                    subtotal: '0.00',
                    shipping: '0.00',
                    tax: '0.00',
                    total: '0.00'
                };
            }

            const subtotal = this.cart.reduce((total, item) => {
                if (!item || typeof item.quantity !== 'number') {
                    console.warn('Invalid cart item:', item);
                    return total;
                }
                const price = this.parsePrice(item.price || 0);
                return total + (price * item.quantity);
            }, 0);
            
            const shipping = subtotal > 100 ? 0 : 9.99;
            const tax = subtotal * 0.21; // 21% Tax
            const total = subtotal + shipping + tax;

            return {
                subtotal: subtotal.toFixed(2),
                shipping: shipping.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2)
            };
        } catch (error) {
            console.error('Error calculating totals:', error);
            return {
                subtotal: '0.00',
                shipping: '0.00', 
                tax: '0.00',
                total: '0.00'
            };
        }
    }

    // Redirect to cart if empty
    redirectToCart() {
        this.showMessage('Your cart is empty. Redirecting...', 'info');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
    }

    // Setup form validation
    setupFormValidation() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;

        // Real-time validation for required fields
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', () => this.validateEmail(emailField));
        }

        // Phone validation
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', () => this.formatPhone(phoneField));
        }

        // Postal code validation
        const postalCodeField = document.getElementById('postalCode');
        if (postalCodeField) {
            postalCodeField.addEventListener('input', () => this.validatePostalCode(postalCodeField));
        }
    }

    // Setup card input formatting
    setupCardFormatting() {
        const cardNumberField = document.getElementById('cardNumber');
        const cardExpiryField = document.getElementById('cardExpiry');
        const cardCvvField = document.getElementById('cardCvv');

        if (cardNumberField) {
            cardNumberField.addEventListener('input', (e) => this.formatCardNumber(e.target));
        }

        if (cardExpiryField) {
            cardExpiryField.addEventListener('input', (e) => this.formatCardExpiry(e.target));
        }

        if (cardCvvField) {
            cardCvvField.addEventListener('input', (e) => this.formatCardCvv(e.target));
        }
    }

    // Format card number with spaces
    formatCardNumber(field) {
        let value = field.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        field.value = value;
        
        // Detect card type
        this.detectCardType(value.replace(/\s/g, ''));
    }

    // Format card expiry MM/YY
    formatCardExpiry(field) {
        let value = field.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        field.value = value;
        
        // Validate expiry date
        this.validateCardExpiry(field);
    }

    // Format CVV (numbers only)
    formatCardCvv(field) {
        field.value = field.value.replace(/\D/g, '');
    }

    // Detect card type and show appropriate icon
    detectCardType(cardNumber) {
        const cardIcons = document.querySelectorAll('.payment-icons i');
        cardIcons.forEach(icon => icon.style.opacity = '0.3');

        if (cardNumber.startsWith('4')) {
            // Visa
            const visaIcon = document.querySelector('.fa-cc-visa');
            if (visaIcon) visaIcon.style.opacity = '1';
        } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
            // Mastercard
            const mastercardIcon = document.querySelector('.fa-cc-mastercard');
            if (mastercardIcon) mastercardIcon.style.opacity = '1';
        } else if (cardNumber.startsWith('3')) {
            // American Express
            const amexIcon = document.querySelector('.fa-cc-amex');
            if (amexIcon) amexIcon.style.opacity = '1';
        }
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        if (isValid && field.type === 'email') {
            isValid = this.isValidEmail(value);
            if (!isValid) errorMessage = 'Invalid email';
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    // Validate email format
    validateEmail(field) {
        const isValid = this.isValidEmail(field.value);
        this.showFieldError(field, isValid, isValid ? '' : 'Invalid email');
        return isValid;
    }

    // Validate card expiry
    validateCardExpiry(field) {
        const value = field.value;
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        let isValid = regex.test(value);

        if (isValid) {
            const [month, year] = value.split('/');
            const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
            const now = new Date();
            isValid = expiry > now;
        }

        this.showFieldError(field, isValid, isValid ? '' : 'Invalid expiration date');
        return isValid;
    }

    // Validate postal code
    validatePostalCode(field) {
        const value = field.value.replace(/\s/g, '');
        // Spanish postal code format: 5 digits
        const isValid = /^\d{5}$/.test(value);
        
        if (isValid) {
            field.value = value;
        }
        
        this.showFieldError(field, isValid, isValid ? '' : 'Postal code must have 5 digits');
        return isValid;
    }

    // Format phone number
    formatPhone(field) {
        let value = field.value.replace(/\D/g, '');
        // Spanish phone format
        if (value.length > 0) {
            if (value.startsWith('34')) {
                value = '+' + value;
            } else if (value.length === 9) {
                value = '+34 ' + value;
            }
        }
        field.value = value;
    }

    // Show field error
    showFieldError(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        field.classList.toggle('error', !isValid);

        if (!isValid && errorMessage) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            formGroup.appendChild(errorElement);
        }
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('error');
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    }

    // Validate entire form
    validateForm() {
        const form = document.getElementById('checkoutForm');
        if (!form) return false;

        let isFormValid = true;
        const requiredFields = form.querySelectorAll('input[required], select[required]');

        requiredFields.forEach(field => {
            const isFieldValid = this.validateField(field);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        // Validate terms acceptance
        const acceptTerms = document.getElementById('acceptTerms');
        if (acceptTerms && !acceptTerms.checked) {
            isFormValid = false;
            this.showMessage('You must accept the terms and conditions', 'error');
        }

        // Validate payment method specific fields
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        if (paymentMethod === 'card') {
            const cardFields = ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv'];
            cardFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    const isFieldValid = this.validateField(field);
                    if (!isFieldValid) {
                        isFormValid = false;
                    }
                }
            });
        }

        return isFormValid;
    }

    // Process order
    async processOrder() {
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (!placeOrderBtn) return;

        // Show loading state
        placeOrderBtn.classList.add('loading');
        placeOrderBtn.querySelector('.loading-spinner').style.display = 'block';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Get form data
            const formData = this.getFormData();
            
            // Process payment (simulation)
            const orderResult = await this.simulatePaymentProcessing(formData);

            if (orderResult.success) {
                // Clear cart
                localStorage.removeItem('shopping-cart');
                
                // Redirect to confirmation page (or show success message)
                this.showOrderSuccess(orderResult.orderId);
            } else {
                throw new Error(orderResult.message);
            }

        } catch (error) {
            this.showMessage('Error al procesar el pedido: ' + error.message, 'error');
        } finally {
            // Hide loading state
            placeOrderBtn.classList.remove('loading');
            placeOrderBtn.querySelector('.loading-spinner').style.display = 'none';
        }
    }

    // Get form data
    getFormData() {
        const form = document.getElementById('checkoutForm');
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Add order details
        data.items = this.cart;
        data.totals = this.calculateTotals();
        data.orderId = 'ORD-' + Date.now();

        return data;
    }

    // Simulate payment processing
    async simulatePaymentProcessing(orderData) {
        // Simulate different payment methods
        const paymentMethod = orderData.paymentMethod;
        
        // Simulate random success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
            return {
                success: true,
                orderId: orderData.orderId,
                message: 'Pago procesado correctamente'
            };
        } else {
            return {
                success: false,
                message: 'Error en el procesamiento del pago. Intenta de nuevo.'
            };
        }
    }

    // Show order success
    showOrderSuccess(orderId) {
        // Create success modal or redirect
        const successMessage = `
            <div class="order-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>¡Pedido Confirmado!</h2>
                <p>Your order <strong>${orderId}</strong> has been processed successfully.</p>
                <p>You will receive a confirmation email shortly.</p>
                <div class="success-actions">
                    <a href="index.html" class="btn btn-primary">Volver al Inicio</a>
                    <a href="products.html" class="btn btn-outline">Seguir Comprando</a>
                </div>
            </div>
        `;

        // Replace page content with success message
        document.querySelector('.checkout-content .container').innerHTML = successMessage;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Attach event listeners
    attachEventListeners() {
        // Form submission
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm()) {
                    this.processOrder();
                }
            });
        }

        // Payment method change
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => this.handlePaymentMethodChange());
        });

        // Same as billing checkbox
        const sameAsBilling = document.getElementById('sameAsBilling');
        if (sameAsBilling) {
            sameAsBilling.addEventListener('change', () => this.toggleBillingAddress());
        }

        // Auto-fill fields from shipping to billing
        const shippingFields = ['address', 'city', 'postalCode'];
        shippingFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('input', () => this.autoFillBilling(fieldName, field.value));
            }
        });

        // Add listeners for PayPal validation - check when required fields change
        const paypalRequiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode'];
        paypalRequiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('input', () => {
                    // Delay validation to avoid constant checking while typing
                    clearTimeout(this.paypalValidationTimeout);
                    this.paypalValidationTimeout = setTimeout(() => {
                        this.handlePaymentMethodChange();
                    }, 300);
                });
                
                field.addEventListener('blur', () => {
                    // Immediate validation when leaving field
                    this.handlePaymentMethodChange();
                });
            }
        });
    }

    // Handle payment method change
    handlePaymentMethodChange() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const cardDetails = document.getElementById('cardDetails');
        const creditCardBtn = document.getElementById('placeOrderBtn');
        const paypalContainer = document.getElementById('paypal-button-container');
        const instructions = document.getElementById('paymentInstructions');

        console.log('Payment method changed to:', selectedMethod);

        // Hide all payment options first
        if (creditCardBtn) creditCardBtn.style.display = 'none';
        if (paypalContainer) paypalContainer.style.display = 'none';
        if (instructions) instructions.style.display = 'block';

        // Handle card details visibility
        if (cardDetails) {
            if (selectedMethod === 'card') {
                cardDetails.style.display = 'block';
                // Make card fields required
                const cardFields = cardDetails.querySelectorAll('input');
                cardFields.forEach(field => field.setAttribute('required', ''));
                
                // Show credit card button
                if (creditCardBtn) {
                    creditCardBtn.style.display = 'block';
                    if (instructions) instructions.style.display = 'none';
                }
            } else {
                cardDetails.style.display = 'none';
                // Remove required attribute from card fields
                const cardFields = cardDetails.querySelectorAll('input');
                cardFields.forEach(field => field.removeAttribute('required'));
            }
        }

        // Show PayPal button for PayPal method
        if (selectedMethod === 'paypal') {
            if (paypalContainer) {
                console.log('🔍 Checking PayPal conditions...');
                const fieldsValid = this.areRequiredFieldsFilled();
                
                if (!fieldsValid) {
                    console.log('❌ Required fields not filled, showing message');
                    // Show message instead of PayPal button
                    paypalContainer.innerHTML = '<div style="padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; text-align: center; color: #856404; font-weight: 500;">⚠️ Please complete all required shipping information above to enable PayPal payment.</div>';
                    paypalContainer.style.display = 'block';
                } else {
                    console.log('✅ All fields valid, setting up PayPal button');
                    // Show PayPal button
                    paypalContainer.style.display = 'block';
                    // Always re-initialize PayPal buttons when fields are valid
                    paypalContainer.innerHTML = ''; // Clear any messages
                    this.setupPayPalButtons();
                }
                
                if (instructions) instructions.style.display = 'none';
            } else {
                console.error('❌ PayPal container not found');
            }
        }

        // Show credit card button for bank transfer (as fallback)
        if (selectedMethod === 'transfer') {
            if (creditCardBtn) {
                creditCardBtn.style.display = 'block';
                if (instructions) instructions.style.display = 'none';
            }
        }
    }

    // Toggle billing address section
    toggleBillingAddress() {
        const sameAsBilling = document.getElementById('sameAsBilling');
        const billingSection = document.getElementById('billingSection');

        if (billingSection) {
            if (sameAsBilling.checked) {
                billingSection.style.display = 'none';
                // Remove required attributes
                const billingFields = billingSection.querySelectorAll('input');
                billingFields.forEach(field => field.removeAttribute('required'));
            } else {
                billingSection.style.display = 'block';
                // Add required attributes
                const billingFields = billingSection.querySelectorAll('input');
                billingFields.forEach(field => field.setAttribute('required', ''));
            }
        }
    }

    // Auto-fill billing address from shipping
    autoFillBilling(fieldName, value) {
        const sameAsBilling = document.getElementById('sameAsBilling');
        if (!sameAsBilling || !sameAsBilling.checked) return;

        const billingField = document.getElementById('billing' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1));
        if (billingField) {
            billingField.value = value;
        }
    }

    // Show message to user
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${text}
        `;

        const container = document.querySelector('.checkout-content .container');
        if (container) {
            container.insertBefore(message, container.firstChild);
            
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 5000);
        }
    }

    // Utility function to validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Initialize PayPal integration
    initializePayPal() {
        console.log('Initializing PayPal...');
        
        // Check if PayPal SDK is loaded
        if (typeof paypal === 'undefined') {
            console.error('PayPal SDK not loaded');
            return;
        }

        // Setup payment method change handlers
        this.setupPaymentMethodHandlers();

        // Initialize PayPal buttons
        this.setupPayPalButtons();

        // Setup field listeners to update PayPal availability
        this.setupPayPalFieldListeners();
    }

    // Setup payment method change handlers
    setupPaymentMethodHandlers() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        const creditCardBtn = document.getElementById('placeOrderBtn');
        const paypalContainer = document.getElementById('paypal-button-container');
        const instructions = document.getElementById('paymentInstructions');

        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                const selectedMethod = e.target.value;
                console.log('PayPal handler - Payment method changed to:', selectedMethod);

                // Hide all payment options first
                if (creditCardBtn) creditCardBtn.style.display = 'none';
                if (paypalContainer) paypalContainer.style.display = 'none';
                if (instructions) instructions.style.display = 'block';

                // Show selected payment option
                if (selectedMethod === 'card') {
                    if (creditCardBtn) {
                        creditCardBtn.style.display = 'block';
                        if (instructions) instructions.style.display = 'none';
                    }
                } else if (selectedMethod === 'paypal') {
                    if (paypalContainer) {
                        if (!self.areRequiredFieldsFilled()) {
                            paypalContainer.innerHTML = '<div style="padding: 15px; background: #f0f0f0; border-radius: 5px; text-align: center; color: #666;">Please complete all required shipping information above to enable PayPal payment.</div>';
                            paypalContainer.style.display = 'block';
                        } else {
                            paypalContainer.style.display = 'block';
                            if (paypalContainer.children.length === 0 || paypalContainer.innerHTML.includes('Please complete')) {
                                paypalContainer.innerHTML = '';
                                self.setupPayPalButtons();
                            }
                        }
                        if (instructions) instructions.style.display = 'none';
                    }
                } else if (selectedMethod === 'transfer') {
                    if (creditCardBtn) {
                        creditCardBtn.style.display = 'block';
                        if (instructions) instructions.style.display = 'none';
                    }
                }
            });
        });
    }

    // Setup PayPal buttons
    setupPayPalButtons() {
        const self = this;
        
        console.log('🔧 Setting up PayPal buttons...');
        
        // Double check that PayPal is available
        if (typeof paypal === 'undefined') {
            console.error('❌ PayPal SDK not loaded');
            return;
        }
        
        // Double check that all required fields are filled
        if (!this.areRequiredFieldsFilled()) {
            console.error('❌ Cannot setup PayPal buttons - required fields not filled');
            return;
        }
        
        paypal.Buttons({
            style: {
                layout: 'horizontal',
                color: 'blue',
                shape: 'rect',
                label: 'checkout',
                height: 45
            },

            // Create order
            createOrder: function(data, actions) {
                console.log('Creating PayPal order...');
                
                try {
                    // Validate shipping information
                    const form = document.getElementById('checkoutForm');
                    const shippingSection = document.getElementById('shippingSection');
                    
                    if (form && shippingSection) {
                        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode'];
                        const missingFields = [];
                        
                        requiredFields.forEach(fieldName => {
                            const field = document.getElementById(fieldName);
                            if (field && (!field.value || field.value.trim() === '')) {
                                missingFields.push(fieldName);
                            }
                        });
                        
                        if (missingFields.length > 0) {
                            self.showMessage('Please fill in all required shipping information before proceeding with PayPal payment.', 'error');
                            console.log('Missing required fields:', missingFields);
                            throw new Error('Missing required shipping information');
                        }
                    }
                
                    const totals = self.calculateTotals();
                    const cart = self.cart;

                    if (!cart || cart.length === 0) {
                        self.showMessage('Your cart is empty. Please add items before checkout.', 'error');
                        throw new Error('Cart is empty');
                    }

                    console.log('PayPal order totals:', totals);

                    // Prepare items for PayPal
                    const items = cart.map(item => ({
                        name: item.name || 'Product',
                        unit_amount: {
                            currency_code: 'USD',
                            value: self.parsePrice(item.price).toFixed(2)
                        },
                        quantity: item.quantity.toString()
                    }));

                    const orderPayload = {
                        purchase_units: [{
                            amount: {
                                currency_code: 'USD',
                                value: totals.total,
                                breakdown: {
                                    item_total: {
                                        currency_code: 'USD',
                                        value: totals.subtotal
                                    },
                                    shipping: {
                                        currency_code: 'USD', 
                                        value: totals.shipping
                                    },
                                    tax_total: {
                                        currency_code: 'USD',
                                        value: totals.tax
                                    }
                                }
                            },
                            items: items
                        }]
                    };

                    console.log('Creating PayPal order with payload:', orderPayload);
                    return actions.order.create(orderPayload);

                } catch (error) {
                    console.error('Error creating PayPal order:', error);
                    self.showMessage('Error creating PayPal order: ' + error.message, 'error');
                    throw error;
                }
            },

            // Approve payment
            onApprove: function(data, actions) {
                console.log('PayPal payment approved:', data);
                
                return actions.order.capture().then(function(details) {
                    console.log('Payment captured:', details);
                    
                    // Process successful payment
                    self.handlePayPalSuccess(details);
                });
            },

            // Handle errors
            onError: function(err) {
                console.error('PayPal error:', err);
                self.showMessage('Payment error occurred. Please try again.', 'error');
            },

            // Handle cancellation
            onCancel: function(data) {
                console.log('PayPal payment cancelled:', data);
                self.showMessage('Payment was cancelled.', 'warning');
            }

        }).render('#paypal-button-container');

        console.log('PayPal buttons rendered successfully');
    }

    // Setup field listeners for PayPal availability
    setupPayPalFieldListeners() {
        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode'];
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('input', () => {
                    // Check if PayPal is selected and update its availability
                    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
                    if (selectedMethod === 'paypal') {
                        this.handlePaymentMethodChange();
                    }
                });
            }
        });
    }

    // Check if all required fields for PayPal are filled
    areRequiredFieldsFilled() {
        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode'];
        
        console.log('=== CHECKING REQUIRED FIELDS ===');
        const result = requiredFields.every(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field) {
                console.log(`❌ Field ${fieldName}: NOT FOUND`);
                return false;
            }
            
            const value = field.value ? field.value.trim() : '';
            const isValid = value !== '';
            console.log(`${isValid ? '✅' : '❌'} Field ${fieldName}: "${value}" - Valid: ${isValid}`);
            return isValid;
        });
        
        console.log(`=== RESULT: All required fields filled: ${result} ===`);
        return result;
    }

    // Handle successful PayPal payment
    handlePayPalSuccess(details) {
        console.log('Processing PayPal success:', details);
        
        // Extract payment information
        const transaction = details.purchase_units[0];
        const payer = details.payer;
        
        // Create order data
        const orderData = {
            orderId: details.id,
            paymentMethod: 'PayPal',
            amount: transaction.amount.value,
            currency: transaction.amount.currency_code,
            payer: {
                name: payer.name?.given_name + ' ' + payer.name?.surname,
                email: payer.email_address
            },
            items: this.cart,
            timestamp: new Date().toISOString()
        };

        // Clear cart
        localStorage.removeItem('shopping-cart');
        
        // Redirect to success page with order data
        const orderDataEncoded = encodeURIComponent(JSON.stringify(orderData));
        window.location.href = `success.html?order=${orderDataEncoded}`;
    }
}

// Initialize checkout manager when DOM is loaded
let checkoutManager;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('checkoutForm') || document.getElementById('orderItems')) {
        console.log('Initializing CheckoutManager...');
        checkoutManager = new CheckoutManager();
        
        // Export to window for debugging
        window.checkoutManager = checkoutManager;
        
        console.log('CheckoutManager exported to window');
        
        // Initialize AOS animations if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true
            });
        }
    }
});

// Debugging functions for testing
window.checkCartData = function() {
    const cartData = localStorage.getItem('shopping-cart');
    console.log('=== CART DATA DEBUG ===');
    console.log('Raw localStorage data:', cartData);
    
    if (cartData) {
        try {
            const parsed = JSON.parse(cartData);
            console.log('Parsed cart data:', parsed);
            console.log('Array length:', parsed.length);
            console.log('Is array?', Array.isArray(parsed));
            
            if (Array.isArray(parsed)) {
                parsed.forEach((item, index) => {
                    console.log(`Item ${index}:`, item);
                });
            }
        } catch (e) {
            console.error('Error parsing cart data:', e);
        }
    } else {
        console.log('No cart data found');
    }
    
    if (window.checkoutManager) {
        console.log('CheckoutManager cart:', window.checkoutManager.cart);
    }
};

window.addTestProducts = function() {
    const testProducts = [
        {
            id: 1,
            name: 'Test Product 1',
            price: '$29.99',
            originalPrice: '$39.99',
            image: './assets/images/product-1.jpg',
            category: 'Electronics',
            quantity: 1
        },
        {
            id: 2,
            name: 'Test Product 2', 
            price: '$49.99',
            image: './assets/images/product-2.jpg',
            category: 'Accessories',
            quantity: 2
        }
    ];
    
    localStorage.setItem('shopping-cart', JSON.stringify(testProducts));
    console.log('Test products added to cart:', testProducts);
    console.log('Stored data:', localStorage.getItem('shopping-cart'));
    
    // Reload checkout if manager exists
    if (window.checkoutManager) {
        window.checkoutManager.cart = window.checkoutManager.loadCart();
        window.checkoutManager.renderOrderSummary();
        window.checkoutManager.updateCartCount();
    } else {
        console.error('CheckoutManager not found on window object');
        // Try to reinitialize
        setTimeout(() => {
            if (window.CheckoutManager) {
                window.checkoutManager = new window.CheckoutManager();
            }
        }, 100);
    }
};

window.clearCart = function() {
    localStorage.removeItem('shopping-cart');
    console.log('Cart cleared');
    
    if (window.checkoutManager) {
        window.checkoutManager.cart = [];
        window.checkoutManager.renderOrderSummary();
        window.checkoutManager.updateCartCount();
    }
};

// Debug function for payment methods
window.debugPaymentMethods = function() {
    console.log('=== PAYMENT METHODS DEBUG ===');
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    console.log('Selected payment method:', selectedMethod ? selectedMethod.value : 'None');
    
    const creditCardBtn = document.getElementById('placeOrderBtn');
    const paypalContainer = document.getElementById('paypal-button-container');
    const instructions = document.getElementById('paymentInstructions');
    
    console.log('Credit card button display:', creditCardBtn ? creditCardBtn.style.display : 'Not found');
    console.log('PayPal container display:', paypalContainer ? paypalContainer.style.display : 'Not found');
    console.log('Instructions display:', instructions ? instructions.style.display : 'Not found');
    
    if (window.checkoutManager && typeof window.checkoutManager.handlePaymentMethodChange === 'function') {
        console.log('Calling handlePaymentMethodChange manually...');
        window.checkoutManager.handlePaymentMethodChange();
    }
};

// Debug PayPal specific issues
window.debugPayPal = function() {
    console.log('=== PAYPAL DEBUG ===');
    console.log('PayPal SDK loaded:', typeof paypal !== 'undefined');
    
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
        console.log('PayPal container found');
        console.log('Container display:', paypalContainer.style.display);
        console.log('Container innerHTML:', paypalContainer.innerHTML);
        console.log('Container children count:', paypalContainer.children.length);
    } else {
        console.log('PayPal container NOT found');
    }
    
    // Check if form is valid
    const form = document.getElementById('checkoutForm');
    if (form) {
        console.log('Form is valid:', form.checkValidity());
        console.log('Required fields with errors:');
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.checkValidity()) {
                console.log(`- ${field.name || field.id}: ${field.validationMessage}`);
            }
        });
    }
    
    // Check cart status
    if (window.checkoutManager) {
        console.log('Cart items count:', window.checkoutManager.cart.length);
        console.log('Cart totals:', window.checkoutManager.calculateTotals());
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.CheckoutManager = CheckoutManager;
}

// Force GitHub Pages update - PayPal fix deployed

// Enhanced debugging function for PayPal issues
window.debugPayPalAdvanced = function() {
    console.clear();
    console.log('🔍 ADVANCED PAYPAL DEBUG STARTED');
    console.log('=================================');
    
    // Check PayPal SDK
    console.log('1. PayPal SDK Status:');
    console.log('  - PayPal loaded:', typeof paypal !== 'undefined');
    console.log('  - PayPal.Buttons available:', typeof paypal?.Buttons !== 'undefined');
    
    // Check form fields
    console.log('\n2. Required Fields Status:');
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const value = field.value.trim();
            console.log(`  - ${fieldId}: "${value}" (${value ? '✅ FILLED' : '❌ EMPTY'})`);
        } else {
            console.log(`  - ${fieldId}: ❌ FIELD NOT FOUND`);
        }
    });
    
    // Check payment method
    console.log('\n3. Payment Method:');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        console.log(`  - ${method.value}: ${method.checked ? '✅ SELECTED' : '⭕ not selected'}`);
    });
    
    // Check PayPal container
    console.log('\n4. PayPal Container:');
    const container = document.getElementById('paypal-button-container');
    if (container) {
        console.log('  - Container found: ✅');
        console.log('  - Display:', container.style.display);
        console.log('  - Children count:', container.children.length);
        console.log('  - Inner HTML preview:', container.innerHTML.substring(0, 100) + '...');
    } else {
        console.log('  - Container found: ❌');
    }
    
    // Check checkout manager
    console.log('\n5. Checkout Manager:');
    if (window.checkoutManager) {
        console.log('  - Manager loaded: ✅');
        console.log('  - Cart items:', window.checkoutManager.cart.length);
        try {
            const fieldsValid = window.checkoutManager.areRequiredFieldsFilled();
            console.log('  - Required fields valid:', fieldsValid ? '✅' : '❌');
        } catch (e) {
            console.log('  - Error checking fields:', e.message);
        }
    } else {
        console.log('  - Manager loaded: ❌');
    }
    
    console.log('\n🔍 DEBUG COMPLETE');
    console.log('==================');
    
    // Try to force PayPal update
    if (window.checkoutManager && typeof window.checkoutManager.handlePaymentMethodChange === 'function') {
        console.log('\n🔄 Forcing PayPal update...');
        window.checkoutManager.handlePaymentMethodChange();
    }
};
