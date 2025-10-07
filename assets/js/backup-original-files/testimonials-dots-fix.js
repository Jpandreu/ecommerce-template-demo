// Force Testimonial Dots Size Fix
(function() {
    'use strict';
    
    function fixTestimonialDots() {
        const testimonialBtns = document.querySelectorAll('.testimonial-btn');
        
        if (testimonialBtns.length > 0) {
            testimonialBtns.forEach(function(btn) {
                // Force perfect round circles - larger size
                btn.style.width = '10px';
                btn.style.height = '10px';
                btn.style.minWidth = '10px';
                btn.style.minHeight = '10px';
                btn.style.maxWidth = '10px';
                btn.style.maxHeight = '10px';
                btn.style.borderRadius = '50%';
                btn.style.border = 'none';
                btn.style.outline = 'none';
                btn.style.padding = '0';
                btn.style.margin = '0';
                btn.style.transform = 'none';
                btn.style.boxShadow = 'none';
                btn.style.transition = 'all 0.3s ease';
                btn.style.display = 'inline-block';
                btn.style.flexShrink = '0';
                
                // Set colors
                if (btn.classList.contains('active')) {
                    btn.style.background = '#3b82f6';
                    btn.style.opacity = '1';
                } else {
                    btn.style.background = '#cbd5e1';
                    btn.style.opacity = '0.6';
                }
                
                // Mobile adjustments
                if (window.innerWidth <= 768) {
                    btn.style.width = '8px';
                    btn.style.height = '8px';
                    btn.style.minWidth = '8px';
                    btn.style.minHeight = '8px';
                    btn.style.maxWidth = '8px';
                    btn.style.maxHeight = '8px';
                }
                
                if (window.innerWidth <= 480) {
                    btn.style.width = '7px';
                    btn.style.height = '7px';
                    btn.style.minWidth = '7px';
                    btn.style.minHeight = '7px';
                    btn.style.maxWidth = '7px';
                    btn.style.maxHeight = '7px';
                }
            });
        }
        
        // Fix navigation container
        const testimonialsNav = document.querySelector('.testimonials-nav');
        if (testimonialsNav) {
            let gap = '10px'; // Desktop default - larger gap
            if (window.innerWidth <= 768) {
                gap = '7px';
            }
            if (window.innerWidth <= 480) {
                gap = '6px';
            }
            testimonialsNav.style.gap = gap;
            testimonialsNav.style.display = 'flex';
            testimonialsNav.style.justifyContent = 'center';
            testimonialsNav.style.alignItems = 'center';
            testimonialsNav.style.marginTop = '1rem';
        }
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixTestimonialDots);
    } else {
        fixTestimonialDots();
    }
    
    // Run after a small delay to ensure all styles are loaded
    setTimeout(fixTestimonialDots, 100);
    
    // Run on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(fixTestimonialDots, 50);
    });
    
    // Observer for dynamic content changes
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            let shouldFix = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    const target = mutation.target;
                    if (target.classList && (target.classList.contains('testimonial-btn') || target.classList.contains('testimonials-nav'))) {
                        shouldFix = true;
                    }
                }
            });
            if (shouldFix) {
                setTimeout(fixTestimonialDots, 10);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
})();