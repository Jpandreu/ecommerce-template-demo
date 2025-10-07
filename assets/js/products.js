/* ==========================================================================
   Products Page JavaScript
   ========================================================================== */

// Configuration
const PRODUCTS_PER_PAGE = 6;
let currentPage = 1;
let totalProducts = 0;

// Global protection against multiple script loading
if (!window.ECOMMERCE_SCRIPTS_LOADED) {
    window.ECOMMERCE_SCRIPTS_LOADED = {};
}

// Prevent multiple initializations
let isProductsPageInitialized = false;

// Initialize when DOM is ready  
document.addEventListener('DOMContentLoaded', function() {
    if (window.ECOMMERCE_SCRIPTS_LOADED.productsJs || isProductsPageInitialized) {
        console.log('Products page already initialized, skipping...');
        return;
    }
    window.ECOMMERCE_SCRIPTS_LOADED.productsJs = true;
    initProductsPage();
});

// Main initialization function
function initProductsPage() {
    if (isProductsPageInitialized) return;
    isProductsPageInitialized = true;
    
    console.log('Initializing Products page - single instance');
    
    initFilters();
    initProductGrid();
    initQuickView();
    initCartFunctionality();
    initPagination();
    initViewSwitcher();
    initSorting();
    
    console.log('Products page initialized successfully');
}

// Function to update products counter
function updateProductCount() {
    const visibleProducts = document.querySelectorAll('.product-item:not([style*="display: none"])').length;
    totalProducts = document.querySelectorAll('.product-item').length;
    
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        const startItem = ((currentPage - 1) * PRODUCTS_PER_PAGE) + 1;
        const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, visibleProducts);
        resultsCount.innerHTML = `Showing <strong>${startItem}-${endItem}</strong> of <strong>${totalProducts}</strong> products`;
    }
}

// Function to display products per page
function showProductsByPage(page) {
    const allProducts = document.querySelectorAll('.product-item');
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    
    // Hide all products
    allProducts.forEach((product, index) => {
        if (index >= startIndex && index < endIndex) {
            product.style.display = 'flex';
        } else {
            product.style.display = 'none';
        }
    });
    
    // Update counter
    const visibleCount = Math.min(PRODUCTS_PER_PAGE, allProducts.length - startIndex);
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        const startItem = startIndex + 1;
        const endItem = startIndex + visibleCount;
        resultsCount.innerHTML = `Showing <strong>${startItem}-${endItem}</strong> of <strong>${allProducts.length}</strong> products`;
    }
}

/* ==========================================================================
   Filters Functionality
   ========================================================================== */
function initFilters() {
    // Toggle filters on mobile
    const filtersToggle = document.getElementById('filtersToggle');
    const filtersContent = document.getElementById('filtersContent');
    
    if (filtersToggle && filtersContent) {
        filtersToggle.addEventListener('click', function() {
            filtersContent.classList.toggle('active');
        });
    }
    
    // Category filters
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Filtros de marca
    const brandFilters = document.querySelectorAll('input[name="brand"]');
    brandFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Filtros de rating
    const ratingFilters = document.querySelectorAll('input[name="rating"]');
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (priceRange && minPrice && maxPrice) {
        priceRange.addEventListener('input', function() {
            maxPrice.value = this.value;
            applyFilters();
        });
        
        minPrice.addEventListener('input', applyFilters);
        maxPrice.addEventListener('input', applyFilters);
    }
    
    // Clear filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', clearAllFilters);
    }
}

function applyFilters() {
    const products = document.querySelectorAll('.product-item');
    const selectedCategories = getSelectedValues('category');
    const selectedBrands = getSelectedValues('brand');
    const selectedRatings = getSelectedValues('rating');
    const minPrice = document.getElementById('minPrice')?.value || 0;
    const maxPrice = document.getElementById('maxPrice')?.value || 99999;
    
    let visibleCount = 0;
    
    products.forEach(product => {
        let isVisible = true;
        
        // Filter by category
        if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
            const productCategory = product.dataset.category;
            if (!selectedCategories.includes(productCategory)) {
                isVisible = false;
            }
        }
        
        // Filter by brand
        if (selectedBrands.length > 0) {
            const productBrand = product.dataset.brand;
            if (!selectedBrands.includes(productBrand)) {
                isVisible = false;
            }
        }
        
        // Filter by price
        const productPrice = parseFloat(product.dataset.price);
        if (productPrice < minPrice || productPrice > maxPrice) {
            isVisible = false;
        }
        
        // Filter by rating
        if (selectedRatings.length > 0) {
            const productRating = parseInt(product.dataset.rating);
            const minSelectedRating = Math.min(...selectedRatings.map(r => parseInt(r)));
            if (productRating < minSelectedRating) {
                isVisible = false;
            }
        }
        
        // Apply visibility
        product.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });
    
    // Update results count
    updateResultsCount(visibleCount, products.length);
}

function getSelectedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function clearAllFilters() {
    // Clear all checkboxes
    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    // Reset "all categories" checkbox
    const allCategoriesCheckbox = document.querySelector('input[value="all"]');
    if (allCategoriesCheckbox) {
        allCategoriesCheckbox.checked = true;
    }
    
    // Reset price range
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const priceRange = document.getElementById('priceRange');
    
    if (minPrice) minPrice.value = 0;
    if (maxPrice) maxPrice.value = 500;
    if (priceRange) priceRange.value = 500;
    
    // Show all products
    const products = document.querySelectorAll('.product-item');
    products.forEach(product => {
        product.style.display = 'block';
    });
    
    updateResultsCount(products.length, products.length);
}

function updateResultsCount(visible, total) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.innerHTML = `Showing <strong>${visible}</strong> of <strong>${total}</strong> products`;
    }
}

/* ==========================================================================
   Product Grid Functionality
   ========================================================================== */
function initProductGrid() {
    // Product grid initialization (wishlist functionality removed)
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + 1;
        
        // Enhanced animation with pulse class
        cartCount.classList.add('pulse');
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 600);
    }
}

/* ==========================================================================
   Product Detail Modal
   ========================================================================== */
function initQuickView() {
    // Add click events to product cards and titles
    const productCards = document.querySelectorAll('.product-card');
    const productTitles = document.querySelectorAll('.product-name a');
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('modalClose');
    
    // Add click event to product cards
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons
            if (e.target.closest('.add-to-cart') || e.target.closest('.btn')) return;
            
            const productItem = this.closest('.product-item');
            const productId = getProductIdFromItem(productItem);
            openProductModal(productId);
        });
    });
    
    // Add click event to product title links
    productTitles.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const productItem = this.closest('.product-item');
            const productId = getProductIdFromItem(productItem);
            openProductModal(productId);
        });
    });
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductModal);
    }
    
    // Close modal clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProductModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeProductModal();
        }
    });
    
    // Initialize modal functionality
    initModalFunctionality();
}

function openProductModal(productId) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    // Fetch product data
    const productData = getProductData(productId);
    
    if (productData) {
        // Update modal content
        updateModalContent(productData, productId);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateModalContent(product, productId) {
    // Update title and basic info
    document.getElementById('modalTitle').textContent = 'Product Details';
    document.getElementById('modalProductTitle').textContent = product.name;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalDescription').textContent = product.fullDescription;
    
    // Update images
    document.getElementById('modalMainImage').src = product.image;
    document.getElementById('modalMainImage').alt = product.name;
    document.getElementById('modalThumb1').src = product.image;
    document.getElementById('modalThumb2').src = product.image2 || product.image;
    document.getElementById('modalThumb3').src = product.image3 || product.image;
    
    // Update rating
    updateModalStars(product.rating);
    document.getElementById('modalRatingCount').textContent = `(${product.reviews} reviews)`;
    
    // Update prices
    document.getElementById('modalCurrentPrice').textContent = product.price;
    if (product.originalPrice) {
        document.getElementById('modalOriginalPrice').textContent = product.originalPrice;
        document.getElementById('modalOriginalPrice').style.display = 'inline';
        document.getElementById('modalDiscount').textContent = product.discount;
        document.getElementById('modalDiscount').style.display = 'inline';
    } else {
        document.getElementById('modalOriginalPrice').style.display = 'none';
        document.getElementById('modalDiscount').style.display = 'none';
    }
    
    // Update features
    const featuresContainer = document.getElementById('modalFeatures');
    featuresContainer.innerHTML = '';
    if (product.features) {
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresContainer.appendChild(li);
        });
    }
    
    // Update specifications
    document.getElementById('modalBrand').textContent = product.brand;
    document.getElementById('modalModel').textContent = product.model;
    document.getElementById('modalWarranty').textContent = product.warranty || '1 Year';
    
    // Update badges
    const badgesContainer = document.getElementById('modalBadges');
    badgesContainer.innerHTML = '';
    if (product.badges) {
        product.badges.forEach(badge => {
            const badgeElement = document.createElement('span');
            badgeElement.className = `badge badge-${badge.type}`;
            badgeElement.textContent = badge.text;
            badgesContainer.appendChild(badgeElement);
        });
    }
    
    // Set product ID for add to cart
    document.getElementById('addToCartModal').setAttribute('data-product-id', productId);
}

function updateModalStars(rating) {
    const starsContainer = document.getElementById('modalStars');
    starsContainer.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= rating ? 'fas fa-star' : 'far fa-star';
        starsContainer.appendChild(star);
    }
}

function getProductIdFromItem(productItem) {
    // Try to get ID from various attributes
    return productItem.dataset.productId || 
           productItem.querySelector('.add-to-cart')?.dataset.productId || 
           productItem.querySelector('.product-name a')?.href.split('id=')[1] ||
           Array.from(document.querySelectorAll('.product-item')).indexOf(productItem) + 1;
}

function initModalFunctionality() {
    // Quantity controls
    const quantityMinus = document.getElementById('quantityMinus');
    const quantityPlus = document.getElementById('quantityPlus');
    const quantityInput = document.getElementById('modalQuantity');
    
    if (quantityMinus) {
        quantityMinus.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (quantityPlus) {
        quantityPlus.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value) || 1;
            const maxValue = parseInt(quantityInput.max) || 10;
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('modalMainImage');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
            const newSrc = this.querySelector('img').src;
            mainImage.src = newSrc;
        });
    });
    
    // Add to cart from modal
    const addToCartModal = document.getElementById('addToCartModal');
    if (addToCartModal) {
        addToCartModal.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
            const color = document.querySelector('.color-option.active')?.dataset.color;
            const size = document.getElementById('modalSize').value;
            
            addToCartFromModal(productId, quantity, { color, size });
            closeProductModal();
        });
    }
    
    // Buy now from modal
    const buyNowModal = document.getElementById('buyNowModal');
    if (buyNowModal) {
        buyNowModal.addEventListener('click', function() {
            const productId = document.getElementById('addToCartModal').getAttribute('data-product-id');
            const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
            const color = document.querySelector('.color-option.active')?.dataset.color;
            const size = document.getElementById('modalSize').value;
            
            addToCartFromModal(productId, quantity, { color, size });
            closeProductModal();
            // Redirect to checkout
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        });
    }
}

function addToCartFromModal(productId, quantity, options) {
    // Enhanced add to cart with options
    const product = getProductData(productId);
    if (product) {
        const cartItem = {
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            options: options
        };
        
        // Add to cart (integrate with existing cart system)
        if (typeof addToCart === 'function') {
            for (let i = 0; i < quantity; i++) {
                addToCart(productId);
            }
        }
        
        // Show success message
        showNotification(`${product.name} added to cart!`, 'success');
    }
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getProductData(productId) {
    // Enhanced product data with complete information
    const products = {
        '1': {
            name: 'Smartphone Premium Pro Max',
            category: 'Electronics',
            image: './assets/images/product1.jpg',
            image2: './assets/images/product1.jpg',
            image3: './assets/images/product1.jpg',
            description: 'Latest model with advanced technology and professional camera.',
            fullDescription: 'Experience the future with our flagship smartphone featuring cutting-edge technology, professional-grade camera system, and all-day battery life. Perfect for photography enthusiasts, business professionals, and tech lovers who demand the best performance.',
            price: '$299.99',
            originalPrice: '$399.99',
            discount: '-25%',
            rating: 5,
            reviews: 24,
            brand: 'Premium Brand',
            model: 'Pro Max 2025',
            warranty: '2 Years',
            features: [
                'Professional triple camera system with AI enhancement',
                '6.7-inch Super Retina XDR display',
                '5G connectivity for ultra-fast internet',
                'All-day battery life with wireless charging',
                'Face ID and fingerprint security',
                'Water and dust resistant (IP68)'
            ],
            badges: [
                { type: 'new', text: 'New' }
            ]
        },
        '2': {
            name: 'Elegant Premium Jacket',
            category: 'Fashion',
            image: './assets/images/product2.jpg',
            image2: './assets/images/product2.jpg',
            image3: './assets/images/product2.jpg',
            description: 'High-quality jacket with modern design and premium materials.',
            fullDescription: 'Elevate your style with this sophisticated jacket crafted from premium materials. Features a modern cut, versatile design, and superior comfort for any occasion. Perfect for business meetings, casual outings, or special events.',
            price: '$89.99',
            rating: 4,
            reviews: 18,
            brand: 'Excellence',
            model: 'Classic Fit',
            warranty: '1 Year',
            features: [
                'Premium fabric blend for durability and comfort',
                'Modern tailored fit for all body types',
                'Versatile design suitable for any occasion',
                'Easy care - machine washable',
                'Available in multiple colors and sizes',
                'Breathable fabric for all-season wear'
            ],
            badges: []
        },
        '3': {
            name: 'Modern Design Lamp',
            category: 'Home',
            image: './assets/images/product3.jpg',
            image2: './assets/images/product3.jpg',
            image3: './assets/images/product3.jpg',
            description: 'Table lamp with contemporary design and LED technology.',
            fullDescription: 'Illuminate your space with this stunning modern lamp featuring energy-efficient LED technology and contemporary design. Perfect for creating ambient lighting in your home, office, or studio with adjustable brightness and color temperature.',
            price: '$149.99',
            originalPrice: '$214.99',
            discount: '-30%',
            rating: 5,
            reviews: 31,
            brand: 'Quality Plus',
            model: 'LED Smart 2025',
            warranty: '3 Years',
            features: [
                'Energy-efficient LED technology',
                'Adjustable brightness and color temperature',
                'Contemporary minimalist design',
                'Touch controls with memory function',
                'Compatible with smart home systems',
                'Long-lasting 50,000-hour LED lifespan'
            ],
            badges: [
                { type: 'sale', text: '-30%' }
            ]
        },
        '4': {
            name: 'Wireless Pro Headphones',
            category: 'Electronics',
            image: './assets/images/product4.jpg',
            image2: './assets/images/product4.jpg',
            image3: './assets/images/product4.jpg',
            description: 'Headphones with active noise cancellation and superior audio quality.',
            fullDescription: 'Experience immersive audio with our professional wireless headphones featuring active noise cancellation, premium sound quality, and long-lasting comfort. Perfect for audiophiles, travelers, and professionals who demand exceptional audio performance.',
            price: '$199.99',
            rating: 4,
            reviews: 42,
            brand: 'Premium Brand',
            model: 'Pro Audio 2025',
            warranty: '2 Years',
            features: [
                'Active noise cancellation technology',
                'Superior audio quality with custom drivers',
                '30-hour battery life with quick charge',
                'Comfortable over-ear design for extended use',
                'Bluetooth 5.0 with multi-device connectivity',
                'Voice assistant integration'
            ],
            badges: []
        },
        '5': {
            name: 'Pro Running Shoes',
            category: 'Sports',
            image: './assets/images/product5.jpg',
            image2: './assets/images/product5.jpg',
            image3: './assets/images/product5.jpg',
            description: 'Running shoes with advanced cushioning technology and ergonomic design.',
            fullDescription: 'Achieve your best performance with these professional running shoes featuring advanced cushioning technology, breathable materials, and ergonomic design. Engineered for runners who demand comfort, support, and style in every step.',
            price: '$79.99',
            rating: 5,
            reviews: 156,
            brand: 'Excellence',
            model: 'ProRun Elite',
            warranty: '1 Year',
            features: [
                'Advanced cushioning technology for impact protection',
                'Breathable mesh upper for ventilation',
                'Ergonomic design for natural foot movement',
                'Durable outsole for various terrains',
                'Lightweight construction for speed',
                'Reflective elements for visibility'
            ],
            badges: [
                { type: 'bestseller', text: 'Best Seller' }
            ]
        },
        '6': {
            name: 'Premium Classic Watch',
            category: 'Fashion',
            image: './assets/images/product6.jpg',
            image2: './assets/images/product6.jpg',
            image3: './assets/images/product6.jpg',
            description: 'Classic wristwatch with Swiss precision mechanism and timeless elegance.',
            fullDescription: 'Experience timeless elegance with this premium classic watch featuring Swiss precision movement, luxury materials, and sophisticated design. Perfect for business professionals and watch enthusiasts who appreciate quality craftsmanship and enduring style.',
            price: '$129.99',
            rating: 4,
            reviews: 73,
            brand: 'Quality Plus',
            model: 'Classic Elite',
            warranty: '5 Years',
            features: [
                'Swiss precision quartz movement',
                'Stainless steel case and bracelet',
                'Scratch-resistant sapphire crystal',
                'Water resistant up to 100 meters',
                'Classic design with modern functionality',
                'Comfortable adjustable bracelet'
            ],
            badges: []
        },
        '7': {
            name: 'Luxury Decorative Cushion',
            category: 'Home',
            image: './assets/images/product7.jpg',
            image2: './assets/images/product7.jpg',
            image3: './assets/images/product7.jpg',
            description: 'Premium velvet cushion with hypoallergenic filling and exclusive designs.',
            fullDescription: 'Transform your living space with this luxurious decorative cushion crafted from premium velvet fabric. Features hypoallergenic filling, exclusive designs, and superior comfort for modern homes that value style and quality.',
            price: '$89.99',
            rating: 5,
            reviews: 67,
            brand: 'Quality Plus',
            model: 'Velvet Luxury',
            warranty: '2 Years',
            features: [
                'Premium velvet fabric for luxury feel',
                'Hypoallergenic filling for sensitive skin',
                'Exclusive modern design patterns',
                'Machine washable cover',
                'Fade-resistant colors',
                'Perfect size for sofas and chairs'
            ],
            badges: []
        },
        '8': {
            name: 'Ultra Professional Tablet',
            category: 'Electronics',
            image: './assets/images/product8.jpg',
            image2: './assets/images/product8.jpg',
            image3: './assets/images/product8.jpg',
            description: 'High-performance tablet with 4K display and latest generation processor.',
            fullDescription: 'Unleash your creativity and productivity with this ultra-professional tablet featuring stunning 4K display, powerful processor, and professional stylus compatibility. Perfect for designers, artists, and professionals who need portable powerhouse performance.',
            price: '$449.99',
            rating: 5,
            reviews: 89,
            brand: 'Premium Brand',
            model: 'Ultra Pro 2025',
            warranty: '3 Years',
            features: [
                'Stunning 4K Ultra HD display',
                'Latest generation high-performance processor',
                'Professional stylus compatibility',
                'All-day battery life up to 12 hours',
                'Premium aluminum construction',
                'Advanced camera system for scanning'
            ],
            badges: [
                { type: 'new', text: 'New' }
            ]
        },
        '9': {
            name: 'Handcrafted Leather Bag',
            category: 'Fashion',
            image: './assets/images/product9.jpg',
            image2: './assets/images/product9.jpg',
            image3: './assets/images/product9.jpg',
            description: 'Genuine handmade leather bag with luxury finishes and multiple compartments.',
            fullDescription: 'Carry your essentials in style with this exquisite handcrafted leather bag made from genuine leather. Features luxury finishes, multiple organized compartments, and timeless design that improves with age.',
            price: '$179.99',
            rating: 4,
            reviews: 134,
            brand: 'Excellence',
            model: 'Artisan Craft',
            warranty: '5 Years',
            features: [
                'Genuine full-grain leather construction',
                'Handcrafted with attention to detail',
                'Multiple organized compartments',
                'Luxury hardware and finishes',
                'Adjustable shoulder strap',
                'Improves with age and use'
            ],
            badges: []
        },
        '10': {
            name: 'ProTech Sports Helmet',
            category: 'Sports',
            image: './assets/images/product10.jpg',
            image2: './assets/images/product10.jpg',
            image3: './assets/images/product10.jpg',
            description: 'Sports helmet with advanced ventilation and multi-impact protection system.',
            fullDescription: 'Stay safe and comfortable during your adventures with this professional sports helmet featuring advanced ventilation technology, multi-impact protection, and lightweight construction. Essential for cycling, skating, and extreme sports enthusiasts.',
            price: '$159.99',
            rating: 5,
            reviews: 203,
            brand: 'Premium Brand',
            model: 'ProTech Elite',
            warranty: '3 Years',
            features: [
                'Advanced multi-impact protection system',
                'Superior ventilation technology',
                'Lightweight yet durable construction',
                'Adjustable fit system for all head sizes',
                'Reflective elements for visibility',
                'Removable and washable inner padding'
            ],
            badges: [
                { type: 'bestseller', text: 'Best Seller' }
            ]
        },
        '11': {
            name: 'Smart Robot Vacuum',
            category: 'Home',
            image: './assets/images/product11.jpg',
            image2: './assets/images/product11.jpg',
            image3: './assets/images/product11.jpg',
            description: 'Robotic vacuum with laser mapping, app control and self-emptying station.',
            fullDescription: 'Experience the future of home cleaning with this intelligent robot vacuum featuring laser mapping technology, smartphone app control, and self-emptying station. Perfect for busy households who want automated cleaning without compromise.',
            price: '$299.99',
            originalPrice: '$374.99',
            discount: '-20%',
            rating: 4,
            reviews: 98,
            brand: 'Quality Plus',
            model: 'SmartClean Pro',
            warranty: '2 Years',
            features: [
                'Laser mapping for efficient cleaning paths',
                'Smartphone app control and scheduling',
                'Self-emptying station for hands-free operation',
                'Multiple cleaning modes for different surfaces',
                'HEPA filtration for allergen capture',
                'Long-lasting battery with auto-recharge'
            ],
            badges: [
                { type: 'sale', text: '-20%' }
            ]
        },
        '12': {
            name: 'Portable Bluetooth Speaker',
            category: 'Electronics',
            image: './assets/images/product12.jpg',
            image2: './assets/images/product12.jpg',
            image3: './assets/images/product12.jpg',
            description: 'Water-resistant Bluetooth speaker with 360° sound and 24-hour battery.',
            fullDescription: 'Take your music anywhere with this powerful portable Bluetooth speaker featuring 360-degree sound, water-resistant design, and incredible 24-hour battery life. Perfect for outdoor adventures, pool parties, and travel.',
            price: '$89.99',
            rating: 5,
            reviews: 176,
            brand: 'Excellence',
            model: 'SoundWave 360',
            warranty: '2 Years',
            features: [
                '360-degree immersive sound experience',
                'Water-resistant design (IPX7 rating)',
                'Incredible 24-hour battery life',
                'Bluetooth 5.0 for stable connection',
                'Built-in microphone for hands-free calls',
                'Compact and lightweight for portability'
            ],
            badges: []
        }
    };
    
    return products[productId] || null;
}

function updateStars(container, rating) {
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= rating ? 'fas fa-star' : 'far fa-star';
        container.appendChild(star);
    }
}

/* ==========================================================================
   View Switcher
   ========================================================================== */
function initViewSwitcher() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid view
            if (productsGrid) {
                productsGrid.className = `products-grid ${view}-view`;
            }
        });
    });
}

/* ==========================================================================
   Sorting
   ========================================================================== */
function initSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

function sortProducts(sortBy) {
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(document.querySelectorAll('.product-item'));
    
    products.sort((a, b) => {
        switch (sortBy) {
            case 'name-asc':
                return getProductName(a).localeCompare(getProductName(b));
            case 'name-desc':
                return getProductName(b).localeCompare(getProductName(a));
            case 'price-asc':
                return getProductPrice(a) - getProductPrice(b);
            case 'price-desc':
                return getProductPrice(b) - getProductPrice(a);
            case 'rating':
                return getProductRating(b) - getProductRating(a);
            case 'newest':
                // Simulate newest first (could use data-date attribute)
                return Math.random() - 0.5;
            default:
                return 0;
        }
    });
    
    // Re-append sorted products
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}

function getProductName(product) {
    return product.querySelector('.product-name a').textContent;
}

function getProductPrice(product) {
    return parseFloat(product.dataset.price) || 0;
}

function getProductRating(product) {
    return parseInt(product.dataset.rating) || 0;
}

/* ==========================================================================
   Pagination
   ========================================================================== */
function initPagination() {
    // Show first page products on load
    showProductsByPage(1);
    
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
    const prevButton = document.querySelector('.page-btn.prev');
    const nextButton = document.querySelector('.page-btn.next');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                goToPage(parseInt(this.textContent));
            }
        });
    });
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                goToPage(currentPage - 1);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                goToPage(currentPage + 1);
            }
        });
    }
}

function getCurrentPage() {
    return currentPage;
}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    
    // Show products from selected page
    showProductsByPage(pageNumber);
    
    // Update active button
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
    pageButtons.forEach(btn => btn.classList.remove('active'));
    
    const targetButton = Array.from(pageButtons).find(btn => parseInt(btn.textContent) === pageNumber);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // Update prev/next button states
    const prevButton = document.querySelector('.page-btn.prev');
    const nextButton = document.querySelector('.page-btn.next');
    
    if (prevButton) {
        prevButton.classList.toggle('disabled', pageNumber === 1);
    }
    
    if (nextButton) {
        const totalPages = pageButtons.length;
        nextButton.classList.toggle('disabled', pageNumber === totalPages);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log(`Navigating to page ${pageNumber}`);
}

/* ==========================================================================
   Cart Functionality
   ========================================================================== */
function initCartFunctionality() {
    // Load cart from localStorage and update count
    const savedCart = localStorage.getItem('shopping-cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    // Add event listeners to "add to cart" buttons (prevent duplicates)
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        // Remove any existing listeners first
        button.replaceWith(button.cloneNode(true));
    });
    
    // Re-select buttons after cloning (to remove old listeners)
    const freshButtons = document.querySelectorAll('.add-to-cart');
    freshButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation(); // Prevent other listeners from firing
            
            // Prevent multiple rapid clicks
            if (this.disabled) return;
            this.disabled = true;
            
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                console.log(`Button clicked for product: ${productId}`);
                
                // Store original button text
                const originalText = this.innerHTML;
                
                // Loading animation
                this.innerHTML = '<span class="loading-spinner"></span> Adding...';
                this.disabled = true;
                
                // Call add to cart function
                addToCart(productId);
                
                // Button animation (success state)
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> Added!';
                    this.style.background = '#10b981'; // Success green color
                    this.style.borderColor = '#10b981';
                    
                    // Restore button after 2 seconds
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        this.style.background = '';
                        this.style.borderColor = '';
                    }, 2000);
                }, 500);
            } else {
                // Re-enable button if no product ID
                setTimeout(() => {
                    this.disabled = false;
                }, 1500);
            }
        }, { once: false }); // Allow multiple uses but prevent bubbling
    });
}

// Function to add product to cart
function addToCart(productId) {
    console.log(`products.js addToCart called with productId: ${productId}`);
    
    // Prevent rapid successive calls
    const now = Date.now();
    if (addToCart.lastCall && (now - addToCart.lastCall) < 1000) {
        console.log('Preventing duplicate addToCart call in products.js');
        return;
    }
    addToCart.lastCall = now;
    
    // Check if CartManager is available (from cart.js)
    if (window.cartManager && typeof window.cartManager.addToCart === 'function') {
        window.cartManager.addToCart(productId);
        return;
    }

    // Fallback implementation if CartManager is not available
    const productData = getProductData(productId);
    if (!productData) {
        showNotification('Error: Product not found', 'error');
        return;
    }

    // Load existing cart
    const savedCart = localStorage.getItem('shopping-cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${productData.name} (cantidad actualizada)`, 'success');
    } else {
        cart.push({
            id: productId,
            ...productData,
            quantity: 1
        });
        showNotification(`${productData.name} added to cart`, 'success');
    }

    // Save cart and update count
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
    updateCartCount();
}



// Function to update cart count in header
function updateCartCount() {
    const savedCart = localStorage.getItem('shopping-cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        // Update count text and data attribute
        cartCount.textContent = totalItems;
        cartCount.setAttribute('data-count', totalItems);
        
        // Show/hide badge based on count
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
            
            // Add animation when count changes
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);
        } else {
            cartCount.style.display = 'none';
        }
    }
}

/* ==========================================================================
   Utility Functions
   ========================================================================== */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // Add notification styles if not exist
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 10001;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid var(--success-color);
                color: var(--success-color);
            }
            
            .notification-error {
                border-left: 4px solid var(--error-color);
                color: var(--error-color);
            }
            
            .notification-info {
                border-left: 4px solid var(--primary-color);
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Update localStorage when cart changes
function updateCartStorage() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        localStorage.setItem('cartCount', cartCount.textContent);
    }
}

// Quick view functions (placeholders to prevent errors)
function closeQuickView() {
    console.log('closeQuickView called - placeholder function');
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Show notification function
function showNotification(message, type = 'success') {
    console.log(`Notification: ${message} (${type})`);
    // Simple notification implementation
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 6px;
        z-index: 10000;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export functions for external use
window.ProductsPage = {
    addToCart,
    closeQuickView,
    showNotification
};

// Export getProductData globally
window.getProductData = getProductData;
