/* ==========================================================================
   WebP Image Generation Script
   ========================================================================== */

// This script helps generate WebP versions of images for better performance
// Run this after adding new images to automatically create optimized versions

const imageOptimizer = {
    // Check WebP support in the browser
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webp = new Image();
            webp.onload = webp.onerror = () => {
                resolve(webp.height === 2);
            };
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    },

    // Add WebP support class to document
    async addWebPSupport() {
        const supportsWebP = await this.checkWebPSupport();
        document.documentElement.classList.add(supportsWebP ? 'webp' : 'no-webp');
        return supportsWebP;
    },

    // Convert canvas to WebP if supported
    canvasToWebP(canvas, quality = 0.8) {
        try {
            return canvas.toDataURL('image/webp', quality);
        } catch (e) {
            return canvas.toDataURL('image/jpeg', quality);
        }
    },

    // Generate responsive image sizes
    generateResponsiveSizes(originalWidth) {
        const sizes = [400, 800, 1200, 1600];
        return sizes.filter(size => size <= originalWidth * 1.2);
    },

    // Optimize image with canvas
    optimizeImage(file, maxWidth = 1200, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                // Set canvas size
                canvas.width = width;
                canvas.height = height;

                // Draw and optimize
                ctx.drawImage(img, 0, 0, width, height);
                
                const optimizedDataUrl = this.canvasToWebP(canvas, quality);
                resolve({
                    dataUrl: optimizedDataUrl,
                    width,
                    height,
                    originalSize: file.size,
                    optimizedSize: Math.round(optimizedDataUrl.length * 0.75) // Approximate
                });
            };

            img.src = URL.createObjectURL(file);
        });
    },

    // Instructions for manual optimization
    getOptimizationInstructions() {
        return `
# Image Optimization Instructions

## For Best Performance:

### 1. WebP Conversion
Convert all JPG/PNG images to WebP format:
- Use tools like: https://squoosh.app/ or https://convertio.co/jpg-webp/
- Keep original files as fallbacks
- Name convention: image-name.webp

### 2. Responsive Images
Create multiple sizes for each image:
- Small (400px width): for mobile devices
- Medium (800px width): for tablets
- Large (1200px width): for desktop
- Extra Large (1600px width): for high-DPI displays

### 3. File Organization
Organize images in subfolders:
/assets/images/
  ├── products/
  │   ├── product1.jpg
  │   ├── product-1.webp
  │   ├── product-1-400w.webp
  │   ├── product-1-800w.webp
  │   └── product-1-1200w.webp
  ├── testimonials/
  └── backgrounds/

### 4. HTML Implementation
Use picture element for best browser support:

<picture>
  <source type="image/webp" 
          srcset="./assets/images/product-1-400w.webp 400w,
                  ./assets/images/product-1-800w.webp 800w,
                  ./assets/images/product-1-1200w.webp 1200w"
          sizes="(max-width: 768px) 400px, 
                 (max-width: 1024px) 800px, 
                 1200px">
  <img src="./assets/images/product1.jpg" 
       alt="Product Name"
       loading="lazy">
</picture>

### 5. CSS Background Images
Update CSS for WebP support:

.hero {
    background-image: url('../images/hero-bg.jpg');
}

.webp .hero {
    background-image: url('../images/hero-bg.webp');
}

### 6. Recommended Tools
- Squoosh.app - Online image optimizer
- ImageOptim - Mac app for image optimization  
- TinyPNG - PNG/JPG compression
- WebP Converter - Batch WebP conversion

### 7. Performance Targets
- Images should be < 100KB each
- Total image payload < 1MB per page
- Lazy loading for below-the-fold images
- Critical images preloaded
        `;
    }
};

// Auto-detect WebP support when script loads
document.addEventListener('DOMContentLoaded', () => {
    imageOptimizer.addWebPSupport();
});

// Make available globally
window.imageOptimizer = imageOptimizer;

console.log('Image optimization tools loaded. Use imageOptimizer.getOptimizationInstructions() for detailed guidance.');
