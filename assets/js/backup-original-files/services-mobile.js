// Services Mobile Enhancement Script
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    function enhanceServicesForMobile() {
        const services = document.querySelector('#services');
        if (!services) return;
        
        // Add mobile optimization class
        services.classList.add('mobile-optimized');
        
        // Optimize for mobile viewport
        function optimizeForMobile() {
            const isMobile = window.innerWidth <= 768;
            const isSmallMobile = window.innerWidth <= 375;
            
            if (isMobile) {
                // Add mobile-specific attributes
                services.setAttribute('data-mobile', 'true');
                
                // Optimize AOS animations for mobile
                const serviceCards = services.querySelectorAll('.service-card');
                serviceCards.forEach((card, index) => {
                    if (isSmallMobile) {
                        // Simpler animations for small screens
                        card.setAttribute('data-aos', 'fade-up');
                        card.setAttribute('data-aos-delay', (index * 100).toString());
                        card.setAttribute('data-aos-duration', '300');
                    } else {
                        card.setAttribute('data-aos-duration', '400');
                    }
                });
                
                // Optimize touch interactions
                const serviceLinks = services.querySelectorAll('.service-link');
                serviceLinks.forEach(link => {
                    link.addEventListener('touchstart', function() {
                        this.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                    });
                    
                    link.addEventListener('touchend', function() {
                        setTimeout(() => {
                            this.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                        }, 150);
                    });
                });
                
            } else {
                services.removeAttribute('data-mobile');
            }
        }
        
        // Run on load and resize
        optimizeForMobile();
        
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(optimizeForMobile, 150);
        });
        
        // Ensure proper spacing on mobile
        function adjustMobileSpacing() {
            if (window.innerWidth <= 768) {
                const container = services.querySelector('.container');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const padding = Math.max(16, Math.min(24, window.innerWidth * 0.04));
                    container.style.paddingLeft = padding + 'px';
                    container.style.paddingRight = padding + 'px';
                }
            }
        }
        
        adjustMobileSpacing();
        window.addEventListener('resize', adjustMobileSpacing);
        
        // Improve mobile performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            const serviceCards = services.querySelectorAll('.service-card');
            serviceCards.forEach(card => observer.observe(card));
        }
        
        // Add CSS for in-view animation
        const style = document.createElement('style');
        style.textContent = `
            @media screen and (max-width: 768px) {
                .service-card {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.4s ease, transform 0.4s ease;
                }
                
                .service-card.in-view {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .service-card:nth-child(2) {
                    transition-delay: 0.1s;
                }
                
                .service-card:nth-child(3) {
                    transition-delay: 0.2s;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize when DOM is ready
    ready(enhanceServicesForMobile);
})();