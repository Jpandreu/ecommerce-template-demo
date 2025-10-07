// Services Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeServicesPage();
});

function initializeServicesPage() {
    // Initialize existing modal in HTML
    initExistingModal();
    
    // Initialize service request modals
    initServiceModals();
    
    // Initialize smooth scrolling for service navigation
    initServiceNavigation();
};

/* ==========================================================================
   Service Request Handling
   ========================================================================== */

function handleConsultationRequest(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;    
    // Initialize animation observers
    initServiceAnimations();
    
    // Initialize service form handlers
    initServiceForms();
    
    // Initialize pricing interactions
    initPricingInteractions();
    
    // Make functions globally available
    window.openServiceForm = openServiceForm;
    window.closeServiceModal = closeServiceModal;
}

// Service Modal Management
function initServiceModals() {
    const requestButtons = document.querySelectorAll('[data-service-request]');
    const consultationButtons = document.querySelectorAll('[data-consultation-request]');
    
    // Service request modal
    requestButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceName = this.getAttribute('data-service-request');
            openServiceModal(serviceName);
        });
    });
    
    // Consultation request modal
    consultationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openConsultationModal();
        });
    });
    
    // Close modal handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay') || e.target.closest('.modal-close')) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openServiceModal(serviceName = '') {
    const modalHTML = `
        <div class="modal-overlay" id="serviceModal">
            <div class="modal-content service-modal">
                <div class="modal-header">
                    <h3>Request ${serviceName || 'Service'}</h3>
                    <button type="button" class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="service-form" id="serviceRequestForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="serviceClientName">Full Name *</label>
                                <input type="text" id="serviceClientName" name="clientName" required>
                            </div>
                            <div class="form-group">
                                <label for="serviceClientEmail">Email *</label>
                                <input type="email" id="serviceClientEmail" name="clientEmail" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="serviceClientPhone">Phone</label>
                                <input type="tel" id="serviceClientPhone" name="clientPhone">
                            </div>
                            <div class="form-group">
                                <label for="serviceCompany">Company</label>
                                <input type="text" id="serviceCompany" name="company">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="serviceType">Service Type *</label>
                            <select id="serviceType" name="serviceType" required>
                                <option value="">Select a service</option>
                                <option value="consultoria" ${serviceName.includes('Strategic') ? 'selected' : ''}>Strategic Consulting</option>
                                <option value="implementacion" ${serviceName.includes('Implementation') ? 'selected' : ''}>Technical Implementation</option>
                                <option value="soporte" ${serviceName.includes('Support') ? 'selected' : ''}>Continuous Support</option>
                                <option value="personalizado">Custom Service</option>
                            </select>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="serviceBudget">Estimated Budget</label>
                                <select id="serviceBudget" name="budget">
                                    <option value="">Select a range</option>
                                    <option value="1000-5000">$1,000 - $5,000</option>
                                    <option value="5000-10000">$5,000 - $10,000</option>
                                    <option value="10000-25000">$10,000 - $25,000</option>
                                    <option value="25000+">$25,000+</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="serviceTimeline">Desired Timeline</label>
                                <select id="serviceTimeline" name="timeline">
                                    <option value="">Select a timeframe</option>
                                    <option value="inmediato">Immediate (1-2 weeks)</option>
                                    <option value="corto">Short term (1 month)</option>
                                    <option value="medio">Medium term (3 months)</option>
                                    <option value="largo">Long term (6+ months)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="serviceDescription">Project Description *</label>
                            <textarea id="serviceDescription" name="description" rows="4" required placeholder="Describe your project, specific needs and objectives..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" required>
                                <span class="checkmark"></span>
                                I accept the <a href="#" target="_blank">privacy policy</a> and <a href="#" target="_blank">data processing</a> *
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="newsletter">
                                <span class="checkmark"></span>
                                I want to receive information about new services and special offers
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary btn-full">
                                <i class="fas fa-paper-plane"></i>
                                Send Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Initialize form handler
    const form = document.getElementById('serviceRequestForm');
    form.addEventListener('submit', handleServiceRequest);
}

function openConsultationModal() {
    const modalHTML = `
        <div class="modal-overlay" id="consultationModal">
            <div class="modal-content service-modal">
                <div class="modal-header">
                    <h3>Request Free Consultation</h3>
                    <button type="button" class="modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="consultation-info">
                        <div class="consultation-benefits">
                            <h4><i class="fas fa-star"></i> What's included in your free consultation?</h4>
                            <ul>
                                <li><i class="fas fa-check"></i> Initial analysis of your needs</li>
                                <li><i class="fas fa-check"></i> Personalized recommendations</li>
                                <li><i class="fas fa-check"></i> Project proposal without commitment</li>
                                <li><i class="fas fa-check"></i> Time and cost estimation</li>
                            </ul>
                        </div>
                    </div>
                    
                    <form class="service-form" id="consultationForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="consultationName">Full Name *</label>
                                <input type="text" id="consultationName" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="consultationEmail">Email *</label>
                                <input type="email" id="consultationEmail" name="email" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="consultationPhone">Phone *</label>
                                <input type="tel" id="consultationPhone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="consultationCompany">Company</label>
                                <input type="text" id="consultationCompany" name="company">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="consultationInterest">Area of Interest *</label>
                            <select id="consultationInterest" name="interest" required>
                                <option value="">Select an area</option>
                                <option value="consultoria">Strategic Consulting</option>
                                <option value="desarrollo">Development & Implementation</option>
                                <option value="soporte">Support & Maintenance</option>
                                <option value="transformacion">Digital Transformation</option>
                                <option value="otro">Other - Specify in message</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="consultationPreference">Contact Preference *</label>
                            <select id="consultationPreference" name="contactPreference" required>
                                <option value="">How do you prefer us to contact you?</option>
                                <option value="llamada">Phone call</option>
                                <option value="videollamada">Video call (Zoom, Teams)</option>
                                <option value="presencial">In-person meeting</option>
                                <option value="email">Email with detailed proposal</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="consultationAvailability">Preferred Availability</label>
                            <select id="consultationAvailability" name="availability">
                                <option value="">Select your availability</option>
                                <option value="manana-laborable">Mornings (weekdays)</option>
                                <option value="tarde-laborable">Afternoons (weekdays)</option>
                                <option value="fin-semana">Weekends</option>
                                <option value="flexible">Flexible schedule</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="consultationMessage">Tell us about your project</label>
                            <textarea id="consultationMessage" name="message" rows="3" placeholder="Briefly describe your project or the needs you want to address..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" required>
                                <span class="checkmark"></span>
                                I accept the <a href="#" target="_blank">privacy policy</a> *
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary btn-full">
                                <i class="fas fa-calendar-check"></i>
                                Request Free Consultation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Initialize form handler
    const form = document.getElementById('consultationForm');
    form.addEventListener('submit', handleConsultationRequest);
}

function closeModal() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.remove();
    });
    document.body.style.overflow = '';
}

// Service Navigation
function initServiceNavigation() {
    // Smooth scroll for internal service links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
}

// Service Animations
function initServiceAnimations() {
    // Animate service cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-detailed-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Animate process steps
    const processSteps = document.querySelectorAll('.step');
    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(step);
    });
}

// Form Handlers
function initServiceForms() {
    // Contact form in services page (if exists)
    const contactForm = document.getElementById('serviceContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleServiceContact);
    }
}

function handleServiceRequest(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Request sent successfully! We will contact you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Close modal
        closeModal();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Log form data (replace with actual API call)
        console.log('Service Request Data:', Object.fromEntries(formData));
        
        // Optional: Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Service Request',
                'event_label': formData.get('serviceType')
            });
        }
    }, 2000);
}

function handleConsultationRequest(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Consultation scheduled! You will receive a confirmation email.', 'success');
        
        // Reset form
        form.reset();
        
        // Close modal
        closeModal();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Log form data (replace with actual API call)
        console.log('Consultation Request Data:', Object.fromEntries(formData));
        
        // Optional: Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'consultation_request', {
                'event_category': 'Lead Generation',
                'event_label': formData.get('interest')
            });
        }
    }, 2000);
}

function handleServiceContact(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Log form data (replace with actual API call)
        console.log('Service Contact Data:', Object.fromEntries(formData));
    }, 1500);
}

// Pricing Interactions
function initPricingInteractions() {
    // Highlight pricing tiers on hover
    const pricingTiers = document.querySelectorAll('.price-option, .support-tier');
    
    pricingTiers.forEach(tier => {
        tier.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        tier.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add click handlers for pricing selection
    const selectButtons = document.querySelectorAll('[data-pricing-select]');
    selectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const plan = this.getAttribute('data-pricing-select');
            selectPricingPlan(plan);
        });
    });
}

function selectPricingPlan(plan) {
    // Pre-fill service request form with selected plan
    setTimeout(() => {
        openServiceModal(`Plan ${plan}`);
        
        // Pre-select the service type if form exists
        setTimeout(() => {
            const serviceTypeSelect = document.getElementById('serviceType');
            if (serviceTypeSelect && plan) {
                // Map plan names to service types
                const planMapping = {
                    'Basic': 'consultoria',
                    'Professional': 'implementacion',
                    'Enterprise': 'soporte',
                    'Basic Support': 'soporte',
                    'Professional Support': 'soporte',
                    'Enterprise Support': 'soporte'
                };
                
                if (planMapping[plan]) {
                    serviceTypeSelect.value = planMapping[plan];
                }
            }
        }, 100);
    }, 100);
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                min-width: 300px;
                max-width: 500px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-left: 4px solid #10B981;
            }
            .notification-error {
                border-left: 4px solid #EF4444;
            }
            .notification-info {
                border-left: 4px solid #3B82F6;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            .notification-content i {
                font-size: 1.25rem;
            }
            .notification-success .notification-content i {
                color: #10B981;
            }
            .notification-error .notification-content i {
                color: #EF4444;
            }
            .notification-info .notification-content i {
                color: #3B82F6;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1rem;
                color: #6B7280;
                cursor: pointer;
                padding: 0.25rem;
            }
            @media (max-width: 768px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Functions for existing modal in HTML
function openServiceForm(serviceType) {
    const modal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const serviceTypeSelect = document.getElementById('serviceType');
    
    if (modal && modalTitle && serviceTypeSelect) {
        // Update modal title based on service type
        const titles = {
            'consulting': 'Request Strategic Consulting',
            'implementation': 'Request Technical Implementation', 
            'support': 'Hire Technical Support',
            'support-basic': 'Hire Basic Support',
            'support-pro': 'Hire Professional Support',
            'support-enterprise': 'Hire Enterprise Support'
        };
        
        modalTitle.textContent = titles[serviceType] || 'Request Service';
        
        // Pre-select service type
        serviceTypeSelect.value = serviceType;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('serviceForm');
        if (form) {
            form.reset();
        }
    }
}

// Initialize existing modal functionality
function initExistingModal() {
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.getElementById('closeServiceModal');
    const form = document.getElementById('serviceForm');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeServiceModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeServiceModal();
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleExistingServiceForm);
    }
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeServiceModal();
        }
    });
}

function handleExistingServiceForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Request sent successfully! We will contact you soon.', 'success');
        
        // Close modal and reset
        closeServiceModal();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Log form data (replace with actual API call)
        console.log('Service Form Data:', Object.fromEntries(formData));
        
        // Optional: Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_request', {
                'event_category': 'Service Request',
                'event_label': formData.get('serviceType')
            });
        }
    }, 2000);
}

// Export functions for global use
window.ServicesPage = {
    openServiceModal,
    openConsultationModal,
    closeModal,
    selectPricingPlan,
    showNotification,
    openServiceForm,
    closeServiceModal
};

// Initialize page statistics counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number, .metric-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                let currentValue = 0;
                const increment = finalValue / 50; // Animate in 50 steps
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue + (target.textContent.includes('%') ? '%' : target.textContent.includes('+') ? '+' : '');
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(currentValue) + (target.textContent.includes('%') ? '%' : target.textContent.includes('+') ? '+' : '');
                    }
                }, 40);
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

// Initialize stats animation when page loads
document.addEventListener('DOMContentLoaded', animateStats);
