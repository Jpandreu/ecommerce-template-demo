/* ==========================================================================
   Ecommerce Template Profesional - JavaScript
   
   Copyright © 2025 Josep Andreu
   Licencia: Uso comercial permitido - No redistribuir
   Version: 2.0.0
   
   This code is protected by copyright.
   See LICENSE.md for complete license terms.
   ========================================================================== */

// Global configuration
let currentSlide = 0;
const testimonialsContainer = document.querySelector('.testimonials-slider');

// Global protection against multiple script loading
if (!window.ECOMMERCE_SCRIPTS_LOADED) {
    window.ECOMMERCE_SCRIPTS_LOADED = {};
}

// Prevent multiple initializations
let isMainJsInitialized = false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.ECOMMERCE_SCRIPTS_LOADED.mainJs || isMainJsInitialized) {
        console.log('Main.js already initialized, skipping...');
        return;
    }
    window.ECOMMERCE_SCRIPTS_LOADED.mainJs = true;
    initializeApp();
});

// Safari mobile viewport fix
function fixSafariMobileViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Listen to resize events
    window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    
    // Safari-specific orientation change handling
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
    });
}

// Main initialization function
function initializeApp() {
    if (isMainJsInitialized) return;
    isMainJsInitialized = true;
    
    console.log('Initializing Main.js - single instance');
    
    // Fix Safari mobile viewport
    fixSafariMobileViewport();
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }
    
    // Initialize components
    initMobileMenu();
    initSmoothScrolling();
    initHeaderScroll();
    initTestimonialsSlider();
    initBackToTop();
    initForms();
    initProductCards();
    initScrollIndicator();
    initAddToCartButtons(); // Initialize add to cart functionality
    
    // Debug Safari mobile if needed
    debugSafariMobile();
    
    console.log('Ecommerce Template initialized successfully');
    
    // CRITICAL MOBILE BUTTON FIXES
    if (window.innerWidth <= 768) {
        console.log('📱 Mobile device detected, applying critical fixes');
        setTimeout(() => {
            forceMobileButtonInit();
        }, 1000);
        
        // Reinitialize every 5 seconds on mobile for stubborn buttons
        setInterval(() => {
            forceMobileButtonInit();
        }, 5000);
    } else {
        // Also run on desktop but less frequently
        setTimeout(() => {
            forceMobileButtonInit();
        }, 2000);
    }
}

/* ==========================================================================
   Mobile Menu
   ========================================================================== */
function initMobileMenu() {
    console.log('🍎 Initializing Mobile Menu...');
    
    // Try multiple selectors for menu button and navigation
    const mobileMenuBtn = document.getElementById('mobileMenuBtn') || 
                          document.querySelector('.mobile-menu-btn') ||
                          document.querySelector('.navbar-toggler');
    const nav = document.getElementById('navbarCollapse') || 
                document.getElementById('nav') || 
                document.querySelector('.navbar-collapse') ||
                document.querySelector('.nav');
    
    if (!mobileMenuBtn || !nav) {
        console.error('❌ Mobile menu elements not found:', {
            mobileMenuBtn: !!mobileMenuBtn,
            nav: !!nav,
            mobileMenuBtnElement: mobileMenuBtn,
            navElement: nav
        });
        return;
    }
    
    console.log('✅ Mobile menu elements found');
    
    // Remove any existing event listeners
    const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);
    
    const handleMenuToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🍎 Menu toggle clicked!', {
            nav: nav,
            navId: nav.id,
            navClasses: nav.className
        });
        
        // Check for both Bootstrap navbar and custom mobile menu
        const isOpen = nav.classList.contains('mobile-open') || nav.classList.contains('show');
        console.log('🍎 Safari Mobile menu toggle, isOpen:', isOpen);
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };
    
    // Multiple event handlers for Safari compatibility
    newMobileMenuBtn.addEventListener('click', handleMenuToggle);
    newMobileMenuBtn.addEventListener('touchend', handleMenuToggle, { passive: false });
    
    // Safari-specific touch feedback
    newMobileMenuBtn.addEventListener('touchstart', function(e) {
        console.log('🍎 Touch start on menu button');
        this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        this.style.transform = 'scale(0.95)';
    }, { passive: true });
    
    newMobileMenuBtn.addEventListener('touchcancel', function(e) {
        this.style.backgroundColor = '';
        this.style.transform = '';
    }, { passive: true });
    
    // Configure close button if it exists
    const closeBtn = document.getElementById('mobileCloseBtn') || 
                     document.querySelector('.mobile-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
        closeBtn.addEventListener('touchend', closeMobileMenu, { passive: false });
    }

    // Close menu when clicking on a link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
        link.addEventListener('touchend', closeMobileMenu, { passive: false });
    });
    
    // Close menu when clicking outside (improved for Safari)
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !newMobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('touchend', function(e) {
        if (!nav.contains(e.target) && !newMobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    }, { passive: false });

    // Global touch event delegation for buttons - CRITICAL MOBILE FIX
    document.addEventListener('touchend', function(e) {
        console.log('Touch detected on:', e.target.className, e.target.tagName);
        
        // Handle Add to Cart buttons
        if (e.target && (e.target.classList.contains('add-to-cart') || 
            (e.target.classList.contains('btn-primary') && e.target.textContent.includes('Add to Cart')))) {
            console.log('Mobile Add to Cart touched!');
            e.preventDefault();
            e.stopPropagation();
            
            // Find the product card
            const productCard = e.target.closest('.product-card') || e.target.closest('[data-id]');
            if (productCard) {
                handleAddToCart(productCard);
            }
        }

        // Handle Quick View buttons
        if (e.target && e.target.classList.contains('quick-view-btn')) {
            console.log('Mobile Quick View touched!');
            e.preventDefault();
            e.stopPropagation();
            
            const productId = e.target.getAttribute('data-product-id');
            if (productId && window.quickViewModal) {
                window.quickViewModal.openModal(productId);
            }
        }
    }, { passive: false });

    // Additional click delegation for stubborn buttons
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target.className, e.target.tagName);
        
        // Force handle Add to Cart on any click
        if (e.target && (e.target.classList.contains('add-to-cart') || 
            (e.target.classList.contains('btn-primary') && e.target.textContent.includes('Add to Cart')))) {
            console.log('Fallback Add to Cart clicked!');
            
            const productCard = e.target.closest('.product-card') || e.target.closest('[data-id]');
            if (productCard) {
                handleAddToCart(productCard);
            }
        }

        // Force handle Quick View on any click
        if (e.target && e.target.classList.contains('quick-view-btn')) {
            console.log('Fallback Quick View clicked!');
            
            const productId = e.target.getAttribute('data-product-id');
            if (productId && window.quickViewModal) {
                window.quickViewModal.openModal(productId);
            }
        }
    }, true);    console.log('✅ Mobile menu initialized successfully');
}

// Force button reinitialization for mobile - CRITICAL FIX
function forceMobileButtonInit() {
    console.log('🔄 Force reinitializing mobile buttons...');
    
    // Reinitialize product cards
    initProductCards();
    
    // Force enable all buttons
    document.querySelectorAll('.btn, button, [role="button"]').forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.touchAction = 'manipulation';
        btn.style.cursor = 'pointer';
        
        if (!btn.hasAttribute('data-mobile-fixed')) {
            btn.setAttribute('data-mobile-fixed', 'true');
            
            // Add fallback click handler
            btn.addEventListener('click', function(e) {
                console.log('Fallback click handler fired for:', this.className);
            }, { passive: false });
            
            btn.addEventListener('touchend', function(e) {
                console.log('Fallback touch handler fired for:', this.className);
            }, { passive: false });
        }
    });
    
    console.log('✅ Mobile buttons reinitialized');
}

function openMobileMenu() {
    console.log('🍎 Opening mobile menu...');
    const nav = document.getElementById('navbarCollapse') || 
                document.getElementById('nav') || 
                document.querySelector('.navbar-collapse') ||
                document.querySelector('.nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn') ||
                          document.querySelector('.mobile-menu-btn') ||
                          document.querySelector('.navbar-toggler');
    
    if (!nav || !mobileMenuBtn) {
        console.error('❌ Nav elements not found for opening menu');
        return;
    }
    
    // Handle Bootstrap navbar vs custom menu
    if (nav.classList.contains('navbar-collapse')) {
        nav.classList.add('show');
        mobileMenuBtn.classList.remove('collapsed');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
    } else {
        nav.classList.add('mobile-open');
        mobileMenuBtn.classList.add('active');
    }
    
    // Safari mobile body scroll fix (only for full-screen menus)
    if (!nav.classList.contains('navbar-collapse')) {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        // Store scroll position for later restore
        document.body.dataset.scrollY = scrollY;
    }
    
    // Safari-specific force repaint
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        nav.style.transform = 'translateZ(0)';
        setTimeout(() => {
            nav.offsetHeight; // Force reflow
            nav.style.display = 'flex';
        }, 10);
    }
    
    console.log('✅ Mobile menu opened successfully');
    
    // Add CSS styles for mobile if they don't exist
    if (!document.querySelector('#mobile-nav-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-nav-styles';
        style.textContent = `
            @media (max-width: 767px) {
                .nav.mobile-open {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(10px);
                    z-index: 1001;
                    padding: 6rem 2rem 2rem;
                }
                
                .nav.mobile-open .nav-list {
                    flex-direction: column;
                    gap: 2rem;
                    text-align: center;
                }
                
                .nav.mobile-open .nav-link {
                    font-size: 1.5rem;
                    padding: 1rem 0;
                }
                
                .mobile-menu-btn.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                
                .mobile-menu-btn.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-btn.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -6px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function closeMobileMenu() {
    console.log('🍎 Closing mobile menu...');
    
    const nav = document.getElementById('navbarCollapse') || 
                document.getElementById('nav') || 
                document.querySelector('.navbar-collapse') ||
                document.querySelector('.nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn') ||
                          document.querySelector('.mobile-menu-btn') ||
                          document.querySelector('.navbar-toggler');
    
    if (nav) {
        // Handle Bootstrap navbar vs custom menu
        if (nav.classList.contains('navbar-collapse')) {
            nav.classList.remove('show');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.add('collapsed');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        } else {
            nav.classList.remove('mobile-open');
        }
        console.log('✅ Menu classes removed from nav');
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.style.backgroundColor = '';
        mobileMenuBtn.style.transform = '';
        console.log('✅ Active class removed from button');
    }
    
    // Restore scroll position for Safari mobile (only if body was fixed)
    if (document.body.style.position === 'fixed') {
        const scrollY = document.body.dataset.scrollY;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0'));
            delete document.body.dataset.scrollY;
        }
    }
    
    // Safari mobile fix: force reflow and cleanup
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        setTimeout(() => {
            if (nav) {
                nav.offsetHeight; // Trigger reflow
                nav.style.transform = '';
                nav.style.display = '';
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.offsetHeight; // Trigger reflow
            }
        }, 50);
    }
    
    console.log('✅ Mobile menu closed successfully');
}

// Safari mobile debugging helper
function debugSafariMobile() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        console.log('🍎 Safari Mobile Detection:');
        console.log('- User Agent:', navigator.userAgent);
        console.log('- Window size:', window.innerWidth + 'x' + window.innerHeight);
        console.log('- Screen size:', screen.width + 'x' + screen.height);
        console.log('- Device pixel ratio:', window.devicePixelRatio);
        
        // Test button functionality
        const testButtons = () => {
            const buttons = document.querySelectorAll('.btn');
            console.log(`- Found ${buttons.length} buttons`);
            
            const addToCartButtons = document.querySelectorAll('.btn.btn-primary.btn-full');
            console.log(`- Found ${addToCartButtons.length} add to cart buttons`);
            
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            console.log('- Mobile menu button:', mobileMenuBtn ? 'Found' : 'NOT FOUND');
            
            const nav = document.getElementById('nav');
            console.log('- Navigation element:', nav ? 'Found' : 'NOT FOUND');
        };
        
        setTimeout(testButtons, 1000);
    }
}

/* ==========================================================================
   Smooth Scrolling
   ========================================================================== */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin recargar
                history.pushState(null, null, href);
            }
        });
    });
}

/* ==========================================================================
   Header Scroll Effect
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Cambiar opacidad del header basado en scroll
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on mobile
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

/* ==========================================================================
   Testimonials Slider
   ========================================================================== */
function initTestimonialsSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const buttons = document.querySelectorAll('.testimonial-btn');
    let currentSlide = 0;
    let autoSlideInterval;
    
    if (cards.length === 0 || buttons.length === 0) return;
    
    function showSlide(index) {
        // Hide all cards
        cards.forEach(card => card.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // Show current card
        cards[index].classList.add('active');
        buttons[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % cards.length;
        showSlide(next);
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Event listeners for buttons
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Touch/swipe support for mobile
    let startX = null;
    const slider = document.querySelector('.testimonials-slider');
    
    if (slider) {
        slider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        slider.addEventListener('touchmove', function(e) {
            if (!startX) return;
            
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    const prev = currentSlide === 0 ? cards.length - 1 : currentSlide - 1;
                    showSlide(prev);
                }
                startX = null;
                stopAutoSlide();
                startAutoSlide();
            }
        }, { passive: true });
        
        slider.addEventListener('touchend', function() {
            startX = null;
        }, { passive: true });
    }
    
    // Iniciar auto-slide
    startAutoSlide();
    
    // Pause auto-slide when not visible
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoSlide();
            } else {
                stopAutoSlide();
            }
        });
    });
    
    observer.observe(slider);
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   Form Handling
   ========================================================================== */
function initForms() {
    initContactForm();
    initNewsletterForm();
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm();
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const value = formData.get(fieldName);
        
        if (!value || value.trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate email
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        const emailField = form.querySelector('[name="email"]');
        showFieldError(emailField, 'Please enter a valid email');
        isValid = false;
    }
    
    // Validate privacy checkbox
    const privacyCheckbox = form.querySelector('input[type="checkbox"]');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        showFieldError(privacyCheckbox, 'You must accept the privacy policy');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove previous error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function submitContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    
    // Simulate sending (here you would connect with your backend)
    setTimeout(() => {
        // Show success message
        showSuccessMessage('Message sent successfully! We will respond soon.');
        
        // Reset form
        form.reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    }, 2000);
}

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            showFieldError(emailInput, 'Please enter your email');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFieldError(emailInput, 'Please enter a valid email');
            return;
        }
        
        submitNewsletterForm(email, emailInput);
    });
}

function submitNewsletterForm(email, inputField) {
    const form = inputField.closest('form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    submitBtn.disabled = true;
    
    // Simulate sending
    setTimeout(() => {
        showSuccessMessage('You have successfully subscribed to the newsletter!');
        form.reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(message) {
    // Crear elemento de message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-notification';
    messageDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    // Add styles if they don't exist
    if (!document.querySelector('#success-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'success-notification-styles';
        style.textContent = `
            .success-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            
            .success-notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(messageDiv);
    
    // Show with animation
    setTimeout(() => messageDiv.classList.add('show'), 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

/* ==========================================================================
   Product Cards
   ========================================================================== */
function initProductCards() {
    console.log('🎯 Initializing Product Cards...');
    const productCards = document.querySelectorAll('.product-card:not([data-initialized])');
    console.log(`Found ${productCards.length} product cards to initialize`);
    
    productCards.forEach((card, index) => {
        card.setAttribute('data-initialized', 'true');
        console.log(`Initializing card ${index + 1}:`, card);
        
        // Multiple selectors for Add to Cart buttons
        const addToCartBtn = card.querySelector('.add-to-cart') || 
                            card.querySelector('.btn-primary[data-product-id]') ||
                            card.querySelector('.btn-primary:not(.quick-view-btn)') ||
                            card.querySelector('button[data-product-id]');
        
        // Multiple selectors for Quick View buttons  
        const quickViewBtn = card.querySelector('.quick-view-btn') ||
                            card.querySelector('.btn-white[data-product-id]') ||
                            card.querySelector('.btn[data-product-id]:not(.btn-primary)');
        
        console.log('Buttons found:', { addToCartBtn: !!addToCartBtn, quickViewBtn: !!quickViewBtn });
        
        if (addToCartBtn && !addToCartBtn.hasAttribute('data-listener-added')) {
            addToCartBtn.setAttribute('data-listener-added', 'true');
            console.log('Adding events to Add to Cart button:', addToCartBtn);
            
            const handleAddToCartClick = function(e) {
                console.log('Add to Cart button activated!', e.type);
                e.preventDefault();
                e.stopPropagation();
                
                // Prevent multiple rapid clicks
                if (this.disabled) return;
                this.disabled = true;
                
                // Visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                handleAddToCart(card);
                
                // Re-enable button after short delay
                setTimeout(() => {
                    this.disabled = false;
                }, 1000);
            };

            // Add multiple event types for maximum compatibility
            addToCartBtn.addEventListener('click', handleAddToCartClick);
            addToCartBtn.addEventListener('touchend', handleAddToCartClick, { passive: false });
            addToCartBtn.addEventListener('touchstart', function(e) {
                console.log('Touch start on Add to Cart');
                this.style.opacity = '0.8';
            }, { passive: true });
            addToCartBtn.addEventListener('touchcancel', function(e) {
                this.style.opacity = '';
            }, { passive: true });
            
            // Force button properties
            addToCartBtn.style.pointerEvents = 'auto';
            addToCartBtn.style.touchAction = 'manipulation';
            addToCartBtn.style.cursor = 'pointer';
        }
        
        if (quickViewBtn) {
            console.log('Adding events to Quick View button:', quickViewBtn);
            
            const handleQuickViewClick = function(e) {
                console.log('Quick View button activated!', e.type);
                e.preventDefault();
                e.stopPropagation();
                
                // Visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                handleQuickView(card);
            };

            // Add multiple event types for maximum compatibility
            quickViewBtn.addEventListener('click', handleQuickViewClick);
            quickViewBtn.addEventListener('touchend', handleQuickViewClick, { passive: false });
            quickViewBtn.addEventListener('touchstart', function(e) {
                console.log('Touch start on Quick View');
                this.style.opacity = '0.8';
            }, { passive: true });
            quickViewBtn.addEventListener('touchcancel', function(e) {
                this.style.opacity = '';
            }, { passive: true });
            
            // Force button properties
            quickViewBtn.style.pointerEvents = 'auto';
            quickViewBtn.style.touchAction = 'manipulation';
            quickViewBtn.style.cursor = 'pointer';
        }
    });
}

function handleAddToCart(productCard) {
    console.log(`handleAddToCart called for product card:`, productCard);
    
    const btn = productCard.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    const productId = productCard.dataset.id || productCard.querySelector('[data-id]')?.dataset.id;
    
    console.log(`Product ID found: ${productId}`);
    
    if (!productId) {
        console.error('Product ID not found');
        return;
    }
    
    // Loading animation
    btn.innerHTML = '<i class="fas fa-spinner spinner"></i> Adding...';
    btn.disabled = true;
    
    // Use CartManager if available, otherwise use products.js function
    if (window.cartManager && typeof window.cartManager.addToCart === 'function') {
        console.log('Using CartManager.addToCart');
        window.cartManager.addToCart(productId);
    } else if (window.addToCart && typeof window.addToCart === 'function') {
        console.log('Using window.addToCart');
        window.addToCart(productId);
    }
    
    // Button animation (without duplicate message)
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        btn.style.background = 'var(--success-color)';
        
        // Restore button after 2 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.background = '';
        }, 2000);
    }, 500);
}

function handleQuickView(productCard) {
    const productName = productCard.querySelector('.product-name').textContent;
    console.log(`Quick view: ${productName}`);
    
    // Aquí podrías abrir un modal con más detalles del product
    showSuccessMessage(`Quick view of: ${productName}`);
}

/* ==========================================================================
   Scroll Indicator
   ========================================================================== */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', function() {
        const productsSection = document.getElementById('products');
        if (productsSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = productsSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
    
    // Hide indicator after first scroll
    let hasScrolled = false;
    window.addEventListener('scroll', function() {
        if (!hasScrolled && window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
            hasScrolled = true;
        }
    });
}

/* ==========================================================================
   Utility Functions
   ========================================================================== */

// Debounce function para optimizar eventos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para optimizar scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Intersection Observer para lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without support
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/* ==========================================================================
   Performance Optimizations
   ========================================================================== */

// Optimizar eventos de scroll y resize
const optimizedScrollHandler = throttle(function() {
    // Optimized scroll logic
}, 16);

const optimizedResizeHandler = debounce(function() {
    // Recalculate dimensions if necessary
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
window.addEventListener('resize', optimizedResizeHandler);

/* ==========================================================================
   Error Handling
   ========================================================================== */

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // Here you could send the error to a logging service
});

// Manejo de errores no capturados en promesas
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rechazada no manejada:', e.reason);
    e.preventDefault();
});

/* ==========================================================================
   Accessibility Enhancements
   ========================================================================== */

// Manejo de navegación con teclado
document.addEventListener('keydown', function(e) {
    // Escape para cerrar menú móvil
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Enter y Espacio para botones personalizados
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('custom-button')) {
        e.preventDefault();
        e.target.click();
    }
});

// Detectar si el usuario prefiere navegación con teclado
let isUsingKeyboard = false;

document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    isUsingKeyboard = false;
    document.body.classList.remove('keyboard-navigation');
});

/* ==========================================================================
   SEO and Analytics Helpers
   ========================================================================== */

// Function to update meta tags dynamically
function updateMetaTags(title, description, image) {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', description);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', description);
    }
    
    if (image) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.setAttribute('content', image);
        }
    }
}

// Tracking de eventos (aquí conectarías con Google Analytics, etc.)
function trackEvent(category, action, label, value) {
    // Ejemplo para Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Global addToCart function for products pages
window.addToCart = function(productId, quantity = 1) {
    // Try to get product data from products.js if available
    let productData = null;
    if (typeof window.getProductData === 'function') {
        productData = window.getProductData(productId);
    }
    
    // If no data found, create basic data
    if (!productData) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            const name = productCard.querySelector('.product-name, h3')?.textContent || 'Product';
            const priceElement = productCard.querySelector('.price-current, .product-price');
            const price = priceElement ? priceElement.textContent.replace('$', '') : '0';
            const image = productCard.querySelector('img')?.src || './assets/images/placeholder.jpg';
            
            productData = {
                name: name,
                price: price,
                image: image,
                category: 'General',
                features: 'High quality product'
            };
        }
    }
    
    // Add to cart using CartManager if available
    if (window.cartManager && typeof window.cartManager.addToCart === 'function') {
        // If we have product data, add it to the cart manager's product list
        if (productData && window.cartManager.getProductData) {
            // Add product data to cart manager's product list
            const existingProduct = window.cartManager.getProductData(productId);
            if (!existingProduct) {
                // Add to the product data store
                window.cartManager.productData = window.cartManager.productData || {};
                window.cartManager.productData[productId] = {
                    ...productData,
                    price: parseFloat(productData.price.toString().replace('$', '')),
                    originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice.toString().replace('$', '')) : null
                };
            }
        }
        window.cartManager.addToCart(productId, quantity);
    } else {
        console.log('CartManager not found, adding to localStorage directly');
        // Fallback: add directly to localStorage
        let cart = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else if (productData) {
            cart.push({
                id: productId,
                ...productData,
                price: parseFloat(productData.price.toString().replace('$', '')),
                originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice.toString().replace('$', '')) : null,
                quantity: quantity
            });
        }
        
        localStorage.setItem('shopping-cart', JSON.stringify(cart));
        // Update cart count if function exists
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        console.log('Product added to cart via localStorage');
    }
};

/* ==========================================================================
   Add to Cart Buttons Initialization
   ========================================================================== */
function initAddToCartButtons() {
    console.log('Initializing Add to Cart buttons...');
    
    // Wait for cart manager to be available
    const waitForCartManager = () => {
        if (typeof window.cartManager !== 'undefined') {
            console.log('Cart manager found, setting up buttons');
            setupCartButtons();
        } else {
            console.log('Waiting for cart manager...');
            setTimeout(waitForCartManager, 100);
        }
    };
    
    const setupCartButtons = () => {
        // Find all Add to Cart buttons in index.html
        const addToCartButtons = document.querySelectorAll('.btn.btn-primary.btn-full');
        
        console.log(`Found ${addToCartButtons.length} add to cart buttons`);
        
        addToCartButtons.forEach((button, index) => {
            if (button.textContent.includes('Add to Cart') || button.textContent.includes('Añadir al carrito')) {
                
                // Remove any existing listeners
                button.replaceWith(button.cloneNode(true));
                const newButton = document.querySelectorAll('.btn.btn-primary.btn-full')[index];
                
                // Add click handler for Safari mobile compatibility
                const handleAddToCart = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Add to cart clicked - button', index + 1);
                    
                    // Static products for homepage (matching the displayed products)
                    const products = [
                        { id: 'premium-1', name: 'Premium Product 1', price: 99.99 },
                        { id: 'premium-2', name: 'Premium Product 2', price: 149.99 },
                        { id: 'premium-3', name: 'Premium Product 3', price: 89.99 }
                    ];
                    
                    const product = products[index];
                    if (product && window.cartManager) {
                        window.cartManager.addToCart(product.id);
                        console.log(`Added ${product.name} to cart`);
                    } else {
                        console.error('Product or cart manager not found');
                    }
                };
                
                // Add both click and touch events for maximum compatibility
                newButton.addEventListener('click', handleAddToCart);
                newButton.addEventListener('touchstart', handleAddToCart, { passive: false });
                
                console.log(`Set up cart button ${index + 1}`);
            }
        });
        
        // Also setup Quick View buttons
        const quickViewButtons = document.querySelectorAll('.btn.btn-white.btn-small');
        quickViewButtons.forEach((button, index) => {
            if (button.textContent.includes('Quick View')) {
                const handleQuickView = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Quick view clicked - button', index + 1);
                    
                    // Show product modal (if cart.js is loaded)
                    if (window.cartManager && typeof window.cartManager.showProductModal === 'function') {
                        const productIds = ['premium-1', 'premium-2', 'premium-3'];
                        window.cartManager.showProductModal(productIds[index]);
                    } else {
                        console.warn('Product modal not available');
                    }
                };
                
                button.addEventListener('click', handleQuickView);
                button.addEventListener('touchstart', handleQuickView, { passive: false });
                
                console.log(`Set up quick view button ${index + 1}`);
            }
        });
    };
    
    waitForCartManager();
}

// Exportar funciones para uso externo si es necesario
window.PlantillaEcommerce = {
    trackEvent,
    updateMetaTags,
    showSuccessMessage,
    closeMobileMenu,
    initAddToCartButtons,
    addToCart: window.addToCart
};

// Verificar que el script se ha cargado
console.log('Main.js cargado correctamente');

// Verificar que el script se ha cargado
console.log('Main.js inicializado y listo');

// Final protection against duplicate script loading
if (window.MAIN_JS_LOADED) {
    console.warn('Main.js was loaded multiple times - preventing duplicate execution');
} else {
    window.MAIN_JS_LOADED = true;
}

