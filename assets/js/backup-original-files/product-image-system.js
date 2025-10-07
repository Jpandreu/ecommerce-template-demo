/* ==========================================================================
   Enhanced Image System - Production Ready
   ========================================================================== */

class ProductImageSystem {
    constructor() {
        this.imageCache = new Map();
        this.observer = null;
        this.loadingQueue = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupImageErrorHandling();
        this.preloadCriticalImages();
        this.setupResponsiveImages();
    }

    // Setup Intersection Observer for lazy loading
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
    }

    // Enhanced image loading with WebP support
    async loadImage(img) {
        if (this.loadingQueue.has(img)) return;
        this.loadingQueue.add(img);

        const src = img.dataset.src || img.src;
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        try {
            // Try WebP first if browser supports it
            const supportsWebP = await this.checkWebPSupport();
            const imageSrc = supportsWebP ? webpSrc : src;
            
            const loadedSrc = await this.preloadSingleImage(imageSrc, src);
            
            img.src = loadedSrc;
            img.classList.add('loaded');
            this.imageCache.set(src, loadedSrc);
            
            if (this.observer) {
                this.observer.unobserve(img);
            }
        } catch (error) {
            img.src = './assets/images/placeholder.jpg';
            img.classList.add('error');
        } finally {
            this.loadingQueue.delete(img);
        }
    }

    // Check WebP support
    checkWebPSupport() {
        return new Promise((resolve) => {
            if (this.imageCache.has('webp-support')) {
                resolve(this.imageCache.get('webp-support'));
                return;
            }

            const webp = new Image();
            webp.onload = webp.onerror = () => {
                const supported = webp.height === 2;
                this.imageCache.set('webp-support', supported);
                resolve(supported);
            };
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Preload single image with fallback
    preloadSingleImage(primarySrc, fallbackSrc) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(primarySrc);
            img.onerror = () => {
                if (primarySrc !== fallbackSrc) {
                    const fallbackImg = new Image();
                    fallbackImg.onload = () => resolve(fallbackSrc);
                    fallbackImg.onerror = () => resolve('./assets/images/placeholder.jpg');
                    fallbackImg.src = fallbackSrc;
                } else {
                    resolve('./assets/images/placeholder.jpg');
                }
            };
            img.src = primarySrc;
        });
    }

    // Setup global error handling
    setupImageErrorHandling() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    // Handle image loading errors
    handleImageError(img) {
        if (!img.dataset.errorHandled) {
            img.dataset.errorHandled = 'true';
            img.src = './assets/images/placeholder.jpg';
            img.classList.add('image-error');
            
            // Log error for debugging
            console.warn('Image failed to load:', img.dataset.src || img.src);
        }
    }

    // Preload critical images
    async preloadCriticalImages() {
        const criticalImages = [
            './assets/images/logo.svg',
            './assets/images/hero-bg.jpg',
            './assets/images/product1.jpg',
            './assets/images/product2.jpg',
            './assets/images/product3.jpg'
        ];

        const preloadPromises = criticalImages.map(src => 
            this.preloadSingleImage(src, src).catch(() => src)
        );

        try {
            await Promise.all(preloadPromises);
            console.log('✅ Critical images preloaded');
        } catch (error) {
            console.warn('⚠️ Some critical images failed to preload');
        }
    }

    // Setup responsive images
    setupResponsiveImages() {
        document.querySelectorAll('img[data-sizes]').forEach(img => {
            this.setupResponsiveImage(img);
        });
    }

    // Setup individual responsive image
    setupResponsiveImage(img) {
        const sizes = img.dataset.sizes;
        if (!sizes) return;

        const baseSrc = img.dataset.src || img.src;
        const baseName = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '');
        const extension = baseSrc.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
        
        const sizeArray = sizes.split(',').map(s => parseInt(s.trim()));
        const srcset = sizeArray.map(size => 
            `${baseName}-${size}w${extension} ${size}w`
        ).join(', ');
        
        img.srcset = srcset;
        img.sizes = `(max-width: 768px) ${sizeArray[0]}px, (max-width: 1024px) ${sizeArray[1] || sizeArray[0]}px, ${sizeArray[2] || sizeArray[1] || sizeArray[0]}px`;
    }

    // Add image to lazy loading
    addLazyImage(img) {
        if (this.observer) {
            this.observer.observe(img);
        } else {
            this.loadImage(img);
        }
    }

    // Bulk add images for lazy loading
    addLazyImages(selector = 'img[data-src], img.lazy') {
        document.querySelectorAll(selector).forEach(img => {
            this.addLazyImage(img);
        });
    }

    // Generate optimized image HTML
    generateImageHTML(src, alt, options = {}) {
        const {
            className = '',
            lazy = true,
            responsive = false,
            sizes = [400, 800, 1200],
            loading = 'lazy'
        } = options;

        const baseName = src.replace(/\.(jpg|jpeg|png)$/i, '');
        const extension = src.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
        const webpSrc = `${baseName}.webp`;

        let html = '';

        if (responsive) {
            const srcset = sizes.map(size => `${baseName}-${size}w${extension} ${size}w`).join(', ');
            const webpSrcset = sizes.map(size => `${baseName}-${size}w.webp ${size}w`).join(', ');
            const sizesAttr = `(max-width: 768px) ${sizes[0]}px, (max-width: 1024px) ${sizes[1] || sizes[0]}px, ${sizes[2] || sizes[1] || sizes[0]}px`;

            html = `
                <picture>
                    <source type="image/webp" srcset="${webpSrcset}" sizes="${sizesAttr}">
                    <source type="image/jpeg" srcset="${srcset}" sizes="${sizesAttr}">
                    <img src="${src}" alt="${alt}" class="${className}" loading="${loading}">
                </picture>
            `;
        } else {
            html = `
                <picture>
                    <source type="image/webp" srcset="${webpSrc}">
                    <img src="${src}" alt="${alt}" class="${className}" loading="${loading}">
                </picture>
            `;
        }

        return html.trim();
    }

    // Performance monitoring
    measureImagePerformance() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.initiatorType === 'img') {
                        console.log(`Image loaded: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['resource'] });
        }
    }
}

// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    window.productImageSystem = new ProductImageSystem();
    
    // Add lazy loading to existing images
    window.productImageSystem.addLazyImages();
    
    // Enable performance monitoring in development
    if (window.location.hostname === 'localhost') {
        window.productImageSystem.measureImagePerformance();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductImageSystem;
}
