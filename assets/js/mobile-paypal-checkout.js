// Mobile PayPal Integration for Checkout
(function() {
    'use strict';
    
    let paypalButtonInitialized = false;
    
    // Check if it's mobile device
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Only run on mobile devices
        if (!isMobile()) {
            console.log('Desktop device detected, skipping mobile PayPal');
            return;
        }
        
        // Small delay to ensure PayPal SDK loads
        setTimeout(initMobilePayPalIntegration, 1000);
    });
    
    function initMobilePayPalIntegration() {
        console.log('Initializing Unified PayPal Integration...');
        
        const checkoutForm = document.getElementById('checkoutForm');
        const unifiedPayPalContainer = document.getElementById('unified-paypal-button-container');
        const unifiedInstructions = document.getElementById('unifiedPaymentInstructions');
        const unifiedPaymentBtn = document.getElementById('unifiedPaymentBtn');
        
        // Unified payment method elements
        const paymentMethods = document.getElementById('paymentMethodsUnified');
        const unifiedCreditSection = document.getElementById('unifiedCreditSection');
        const unifiedPaypalSection = document.getElementById('unifiedPaypalSection');
        const creditCardRadio = document.getElementById('unifiedCreditCard');
        const paypalRadio = document.getElementById('unifiedPayPal');
        
        if (!unifiedPayPalContainer || !paymentMethods) {
            console.log('Unified payment elements not found');
            return;
        }
        
        console.log('Elements found:', {
            form: !!checkoutForm,
            paypalContainer: !!unifiedPayPalContainer,
            instructions: !!unifiedInstructions,
            creditBtn: !!unifiedPaymentBtn,
            paymentMethods: !!paymentMethods,
            creditSection: !!unifiedCreditSection,
            paypalSection: !!unifiedPaypalSection
        });
        
        // Get cart total
        function getCartTotal() {
            // Try to get from existing cart system
            if (window.cartManager && typeof window.cartManager.getTotal === 'function') {
                return window.cartManager.getTotal();
            }
            
            // Fallback: try to get from summary totals
            const totalElement = document.querySelector('#summaryTotals .total-price, .final-total, .total-amount');
            if (totalElement) {
                const totalText = totalElement.textContent.replace(/[^0-9.]/g, '');
                return parseFloat(totalText) || 99.99;
            }
            
            return 99.99; // Default fallback
        }
        
        // Initialize PayPal button for unified system
        function initUnifiedPayPalButton() {
            if (paypalButtonInitialized) {
                console.log('PayPal already initialized');
                return;
            }
            
            if (typeof paypal === 'undefined') {
                console.log('PayPal SDK not loaded, retrying in 1 second...');
                setTimeout(initUnifiedPayPalButton, 1000);
                return;
            }
            
            console.log('Creating PayPal button...');
            
            // Clear any existing content
            unifiedPayPalContainer.innerHTML = '';
            
            // Show loading state
            if (unifiedInstructions) {
                unifiedInstructions.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Cargando PayPal...</p>';
                unifiedInstructions.className = 'mobile-payment-instructions';
            }
            
            try {
                paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal',
                    height: 50
                },
                onClick: function(data, actions) {
                    console.log('PayPal button clicked');
                    
                    if (unifiedInstructions) {
                        unifiedInstructions.innerHTML = '<p><i class="fab fa-paypal"></i> Continuando con PayPal...</p>';
                        unifiedInstructions.className = 'mobile-payment-instructions success';
                    }
                    
                    // Return resolved promise to continue with PayPal flow
                    return Promise.resolve();
                },
                createOrder: function(data, actions) {
                    console.log('Creating PayPal order...');
                    const total = getCartTotal();
                    
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: total.toFixed(2),
                                currency_code: 'USD'
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    console.log('PayPal payment approved');
                    return actions.order.capture().then(function(details) {
                        console.log('PayPal payment completed:', details);
                        
                        if (unifiedInstructions) {
                            unifiedInstructions.innerHTML = '<p><i class="fas fa-check-circle"></i> ¡Pago completado con éxito!</p>';
                            unifiedInstructions.className = 'mobile-payment-instructions success';
                        }
                        
                        setTimeout(() => {
                            alert('¡Pago exitoso! Pedido completado.');
                        }, 1000);
                    });
                },
                onError: function(err) {
                    console.error('PayPal error:', err);
                    
                    if (unifiedInstructions) {
                        unifiedInstructions.innerHTML = '<p><i class="fas fa-exclamation-triangle"></i> Error en PayPal. Intenta de nuevo o usa tarjeta.</p>';
                        unifiedInstructions.className = 'mobile-payment-instructions error';
                    }
                },
                onCancel: function(data) {
                    console.log('PayPal payment cancelled');
                    
                    if (unifiedInstructions) {
                        unifiedInstructions.innerHTML = '<p><i class="fab fa-paypal"></i> Pago cancelado. Puedes intentar de nuevo.</p>';
                        unifiedInstructions.className = 'mobile-payment-instructions';
                    }
                }
                }).render('#unified-paypal-button-container');
                
                paypalButtonInitialized = true;
                console.log('PayPal button initialized successfully');
                
                // Update instructions on successful initialization
                if (unifiedInstructions) {
                    unifiedInstructions.innerHTML = '<p><i class="fas fa-credit-card"></i> Elige tu método de pago:</p>';
                    unifiedInstructions.className = 'mobile-payment-instructions success';
                }
                
            } catch (error) {
                console.error('Error initializing PayPal:', error);
                
                // Show retry button instead of hiding completely
                unifiedPayPalContainer.innerHTML = `
                    <button onclick="location.reload()" style="
                        width: 100%; 
                        padding: 12px; 
                        background: #0070ba; 
                        color: white; 
                        border: none; 
                        border-radius: 8px; 
                        cursor: pointer;
                        font-size: 14px;
                    ">
                        <i class="fas fa-redo"></i> Recargar PayPal
                    </button>
                `;
                
                if (unifiedInstructions) {
                    unifiedInstructions.innerHTML = '<p><i class="fas fa-info-circle"></i> PayPal no disponible. Usa tarjeta o recarga la página.</p>';
                    unifiedInstructions.className = 'mobile-payment-instructions';
                }
            }
        }
        

        
        // Handle payment method selection
        function handlePaymentMethodChange() {
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
            
            if (!selectedMethod) return;
            
            // Hide all payment sections first (only on mobile)
            if (isMobile()) {
                unifiedCreditSection.style.display = 'none';
                unifiedPaypalSection.style.display = 'none';
                
                // Hide/show checkout form sections based on selection
                const checkoutFormContainer = document.querySelector('.checkout-form');
                const orderSummary = document.querySelector('.order-summary');
                
                if (selectedMethod.value === 'card') {
                    // Remove PayPal-only mode class
                    document.body.classList.remove('paypal-only-mode');
                    
                    // Show form sections
                    showFormSections();
                    
                    // Show credit card section and full form
                    unifiedCreditSection.style.display = 'block';
                    
                    if (unifiedInstructions) {
                        unifiedInstructions.innerHTML = '<p><i class="fas fa-credit-card"></i> Completa el formulario y procede con el pago</p>';
                        unifiedInstructions.className = 'mobile-payment-instructions success';
                    }
                    
                } else if (selectedMethod.value === 'paypal') {
                    // Hide form sections and show only PayPal
                    hideFormSections();
                    
                    // Add PayPal-only mode class to body
                    document.body.classList.add('paypal-only-mode');
                    
                    // Show PayPal section
                    unifiedPaypalSection.style.display = 'block';
                    
                    if (unifiedInstructions) {
                        unifiedInstructions.innerHTML = '<p><i class="fab fa-paypal"></i> Continúa con PayPal - No necesitas completar el formulario</p>';
                        unifiedInstructions.className = 'mobile-payment-instructions success';
                    }
                    
                    // Initialize PayPal if not already done
                    if (!paypalButtonInitialized) {
                        initUnifiedPayPalButton();
                    }
                }
            }
        }
        
        // Function to hide form sections when PayPal is selected
        function hideFormSections() {
            const sectionsToHide = [
                '.checkout-form .form-section:not(.payment-method-section)',
                '.card-details',
                '.order-summary'
            ];
            
            sectionsToHide.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.style.display = 'none';
                });
            });

            // Add PayPal-only mode class to body
            document.body.classList.add('paypal-only-mode');
            
            console.log('Form sections and order summary hidden for PayPal-only mode');
        }
        
        // Function to show form sections when credit card is selected
        function showFormSections() {
            const sectionsToShow = [
                '.checkout-form .form-section',
                '.card-details',
                '.order-summary'
            ];
            
            sectionsToShow.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.style.display = 'block';
                });
            });

            // Remove PayPal-only mode class from body
            document.body.classList.remove('paypal-only-mode');
            
            console.log('Form sections and order summary restored');
        }
        
        // Add event listeners for payment method selection
        if (creditCardRadio) {
            creditCardRadio.addEventListener('change', handlePaymentMethodChange);
        }
        
        if (paypalRadio) {
            paypalRadio.addEventListener('change', handlePaymentMethodChange);
        }
        
        // Initial setup for mobile
        if (isMobile()) {
            // Hide payment sections until method is selected
            if (unifiedInstructions) {
                unifiedInstructions.innerHTML = '<p><i class="fas fa-hand-pointer"></i> Selecciona tu método de pago arriba</p>';
                unifiedInstructions.className = 'mobile-payment-instructions';
            }
            
            // Check initial selection
            handlePaymentMethodChange();
        }
        
        // Handle credit card button
        if (unifiedPaymentBtn) {
            unifiedPaymentBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Basic form validation
                if (checkoutForm) {
                    const requiredFields = checkoutForm.querySelectorAll('[required]');
                    let allValid = true;
                    
                    requiredFields.forEach(field => {
                        if (field.type === 'checkbox' && !field.checked) {
                            allValid = false;
                        } else if (field.type !== 'checkbox' && !field.value.trim()) {
                            allValid = false;
                        }
                    });
                    
                    if (!allValid) {
                        alert('Por favor completa todos los campos requeridos');
                        return;
                    }
                }
                
                alert('Procesando pago con tarjeta de crédito...');
            });
        }
    }
    
})();