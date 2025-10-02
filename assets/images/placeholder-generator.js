/* ==========================================================================
   Placeholder Images - SVG Generator
   ========================================================================== */

// This file contains configurations to generate placeholder images
// Replace these images with real photographs for your final project

const placeholderConfig = {
    products: [
        {
            name: 'product-1.jpg',
            width: 400,
            height: 300,
            title: 'Premium Product 1',
            color: '#3b82f6',
            textColor: '#ffffff'
        },
        {
            name: 'product-2.jpg', 
            width: 400,
            height: 300,
            title: 'Premium Product 2',
            color: '#10b981',
            textColor: '#ffffff'
        },
        {
            name: 'product-3.jpg',
            width: 400,
            height: 300,
            title: 'Premium Product 3',
            color: '#f59e0b',
            textColor: '#ffffff'
        }
    ],
    testimonials: [
        {
            name: 'testimonial-1.jpg',
            width: 100,
            height: 100,
            initials: 'MG',
            color: '#ec4899'
        },
        {
            name: 'testimonial-2.jpg',
            width: 100, 
            height: 100,
            initials: 'CR',
            color: '#8b5cf6'
        },
        {
            name: 'testimonial-3.jpg',
            width: 100,
            height: 100, 
            initials: 'AM',
            color: '#06b6d4'
        }
    ],
    hero: {
        name: 'hero-bg.jpg',
        width: 1920,
        height: 1080,
        type: 'gradient'
    },
    ogImage: {
        name: 'og-image.jpg',
        width: 1200,
        height: 630,
        title: 'TuTienda - Ecommerce Profesional'
    }
};

// Funciones para generar SVG placeholder
function generateProductPlaceholder(config) {
    return `<svg width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="productGrad${config.name}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${config.color};stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:${config.color};stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#productGrad${config.name})"/>
        <rect x="50" y="50" width="${config.width-100}" height="80" rx="8" fill="rgba(255,255,255,0.2)"/>
        <rect x="70" y="70" width="${config.width-140}" height="20" rx="4" fill="rgba(255,255,255,0.3)"/>
        <rect x="70" y="95" width="${config.width-180}" height="15" rx="4" fill="rgba(255,255,255,0.2)"/>
        <circle cx="${config.width/2}" cy="${config.height-80}" r="25" fill="rgba(255,255,255,0.2)"/>
        <rect x="${config.width/2-15}" y="${config.height-90}" width="30" height="20" rx="10" fill="rgba(255,255,255,0.3)"/>
        <text x="${config.width/2}" y="${config.height-30}" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="${config.textColor}">${config.title}</text>
    </svg>`;
}

function generateTestimonialPlaceholder(config) {
    return `<svg width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="testGrad${config.name}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${config.color};stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:${config.color};stop-opacity:1" />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#testGrad${config.name})"/>
        <text x="50" y="58" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" font-weight="600" fill="white">${config.initials}</text>
    </svg>`;
}

function generateHeroPlaceholder(config) {
    return `<svg width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2563eb;stop-opacity:0.9" />
                <stop offset="50%" style="stop-color:#1d4ed8;stop-opacity:0.7" />
                <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.9" />
            </linearGradient>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrad)"/>
        <rect width="100%" height="100%" fill="url(#dots)"/>
        <circle cx="200" cy="200" r="100" fill="rgba(255,255,255,0.05)"/>
        <circle cx="1600" cy="800" r="150" fill="rgba(255,255,255,0.03)"/>
        <circle cx="800" cy="300" r="80" fill="rgba(255,255,255,0.04)"/>
    </svg>`;
}

function generateOGImagePlaceholder(config) {
    return `<svg width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#ogGrad)"/>
        <rect x="100" y="200" width="1000" height="230" rx="20" fill="rgba(255,255,255,0.1)"/>
        <text x="600" y="280" text-anchor="middle" font-family="Inter, sans-serif" font-size="48" font-weight="700" fill="white">${config.title}</text>
        <text x="600" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" font-weight="400" fill="rgba(255,255,255,0.9)">Plantilla moderna y profesional</text>
        <text x="600" y="360" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" font-weight="400" fill="rgba(255,255,255,0.9)">for ecommerce and services</text>
        <circle cx="200" cy="150" r="40" fill="rgba(255,255,255,0.2)"/>
        <circle cx="1000" cy="500" r="60" fill="rgba(255,255,255,0.15)"/>
    </svg>`;
}

// Instrucciones para el desarrollador:
// 1. Run this script to generate placeholder SVG images
// 2. Convert SVGs to JPG/PNG using online tools or software
// 3. Replace with real product and testimonial images
// 4. Optimize images for web (WebP, compression, etc.)

console.log('Placeholder images configuration ready');
console.log('Generate images using the provided functions');

// Ejemplo de uso:
// const productSvg = generateProductPlaceholder(placeholderConfig.products[0]);
// console.log(productSvg);
