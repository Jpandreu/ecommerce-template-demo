/* ==========================================================================
   Image Loader - Advanced Image Management System
   ========================================================================== */

class ImageLoader {
    constructor() {
        this.observer = null;
        this.imageCache = new Set();
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.preloadCriticalImages();
    }

    // Setup Intersection Observer for lazy loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.observer.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    // Load image with fallback
    async loadImage(img) {
        const src = img.dataset.src || img.src;
        const fallbackSrc = './assets/images/placeholder.jpg';
        
        try {
            const actualSrc = await this.preloadImage(src, fallbackSrc);
            img.src = actualSrc;
            img.classList.add('loaded');
            this.imageCache.add(actualSrc);
        } catch (error) {
            img.src = fallbackSrc;
            img.classList.add('loaded', 'error');
        }
    }

    // Preload image with promise
    preloadImage(src, fallbackSrc) {
        return new Promise((resolve, reject) => {
            if (this.imageCache.has(src)) {
                resolve(src);
                return;
            }

            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(fallbackSrc);
            img.src = src;
        });
    }

    // Setup image optimization attributes
    setupImageOptimization() {
        document.querySelectorAll('img').forEach(img => {
            // Add loading attribute if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Add error handling
            if (!img.onerror) {
                img.onerror = () => {
                    img.src = './assets/images/placeholder.jpg';
                    img.classList.add('image-error');
                };
            }

            // Add load handler for smooth transition
            if (!img.onload) {
                img.onload = () => {
                    img.classList.add('image-loaded');
                };
            }
        });
    }

    // Preload critical images (above the fold)
    async preloadCriticalImages() {
        const criticalImages = [
            './assets/images/logo.svg',
            './assets/images/logo-white.svg',
            './assets/images/hero-bg.jpg'
        ];

        const preloadPromises = criticalImages.map(src => this.preloadImage(src, src));
        
        try {
            await Promise.all(preloadPromises);
            console.log('Critical images preloaded successfully');
        } catch (error) {
            console.warn('Some critical images failed to preload:', error);
        }
    }

    // Load all images (fallback for older browsers)
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }

    // Generate responsive image srcset
    generateSrcSet(basePath, sizes = [400, 800, 1200]) {
        const extension = basePath.split('.').pop();
        const baseName = basePath.replace(`.${extension}`, '');
        
        return sizes.map(size => `${baseName}-${size}w.${extension} ${size}w`).join(', ');
    }

    // Convert regular images to lazy loading
    convertToLazyLoading(selector = 'img') {
        document.querySelectorAll(selector).forEach(img => {
            if (img.src && !img.dataset.src) {
                img.dataset.src = img.src;
                img.src = '';
                img.classList.add('lazy');
                this.observer?.observe(img);
            }
        });
    }

    // Reinitialize observer for new images
    reinitializeImages() {
        if (this.observer) {
            document.querySelectorAll('img[data-src]:not(.observed)').forEach(img => {
                this.observer.observe(img);
                img.classList.add('observed');
            });
        }
    }

    // Add image with proper loading
    createImage(src, alt = '', className = '', lazy = true) {
        const img = document.createElement('img');
        img.alt = alt;
        img.className = className;
        
        if (lazy) {
            img.dataset.src = src;
            img.classList.add('lazy');
            this.observer?.observe(img);
        } else {
            img.src = src;
        }
        
        return img;
    }
}

// Initialize image loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.imageLoader = new ImageLoader();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageLoader;
}
