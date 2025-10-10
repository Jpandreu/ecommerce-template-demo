// Quick View Modal Functionality
class QuickViewModal {
    constructor() {
        console.log('QuickViewModal constructor called');
        this.modal = document.getElementById('quickViewModal');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalClose = document.getElementById('modalClose');
        this.currentProductId = null;
        
        console.log('Modal elements found:', {
            modal: !!this.modal,
            overlay: !!this.modalOverlay,
            close: !!this.modalClose
        });
        
        // Product data
        this.productData = {
            1: {
                name: "Premium Product 1",
                image: "./assets/images/product1.jpg",
                description: "Detailed product description highlighting its main benefits and features. This premium product combines cutting-edge technology with elegant design to deliver an exceptional user experience.",
                currentPrice: 99.99,
                originalPrice: 129.99,
                badge: null,
                features: [
                    "High-quality premium materials",
                    "Innovative design and functionality",
                    "Easy installation and setup",
                    "1-year comprehensive warranty",
                    "24/7 customer support included"
                ],
                specs: {
                    "Dimensions": "12\" x 8\" x 4\"",
                    "Weight": "2.5 lbs",
                    "Material": "Premium aluminum alloy",
                    "Color": "Matte black finish"
                }
            },
            2: {
                name: "Premium Product 2", 
                image: "./assets/images/product2.jpg",
                description: "Innovative design that combines functionality and style for a unique experience. This new product represents the latest in modern technology and user-centered design principles.",
                currentPrice: 149.99,
                originalPrice: null,
                badge: "New",
                features: [
                    "Latest generation technology",
                    "Sleek and modern aesthetic", 
                    "Enhanced performance capabilities",
                    "Eco-friendly construction",
                    "Quick and easy maintenance"
                ],
                specs: {
                    "Dimensions": "10\" x 6\" x 3\"",
                    "Weight": "1.8 lbs", 
                    "Material": "Sustainable composite",
                    "Color": "Pearl white finish"
                }
            },
            3: {
                name: "Premium Product 3",
                image: "./assets/images/product3.jpg", 
                description: "Complete solution integrating advanced technology with intuitive design. This product offers exceptional value with its comprehensive feature set and attractive pricing.",
                currentPrice: 89.99,
                originalPrice: 129.99,
                badge: "-30%",
                features: [
                    "Advanced integrated technology",
                    "User-friendly interface design",
                    "Comprehensive solution package",
                    "Outstanding value proposition",
                    "Proven reliability and performance"
                ],
                specs: {
                    "Dimensions": "14\" x 9\" x 5\"",
                    "Weight": "3.2 lbs",
                    "Material": "Reinforced polymer",
                    "Color": "Charcoal gray finish"
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.setupQuantityControls();
    }
    
    attachEventListeners() {
        // Quick View buttons - multiple approaches for compatibility
        
        // Method 1: Direct event listener on buttons
        setTimeout(() => {
            const quickViewButtons = document.querySelectorAll('.quick-view-btn');
            console.log('Attaching direct listeners to', quickViewButtons.length, 'buttons');
            
            quickViewButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    console.log('Direct button click detected!');
                    const productId = e.target.getAttribute('data-product-id');
                    console.log('Product ID from direct click:', productId);
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.openModal(productId);
                });
            });
        }, 100);
        
        // Method 2: Document event delegation (backup)
        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('quick-view-btn')) {
                console.log('Delegation Quick View button clicked!');
                const productId = e.target.getAttribute('data-product-id');
                console.log('Product ID from delegation:', productId);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.openModal(productId);
            }
        }, true); // Use capture phase
        
        // Modal close events
        this.modalClose?.addEventListener('click', () => this.closeModal());
        this.modalOverlay?.addEventListener('click', () => this.closeModal());
        
        // ESC key close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        // Modal action buttons
        document.getElementById('modalAddToCart')?.addEventListener('click', () => this.addToCart());
        document.getElementById('modalViewDetails')?.addEventListener('click', () => this.viewFullDetails());
    }
    
    setupQuantityControls() {
        const quantityInput = document.getElementById('modalQuantity');
        const quantityMinus = document.getElementById('quantityMinus');
        const quantityPlus = document.getElementById('quantityPlus');
        
        quantityMinus?.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        quantityPlus?.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 99) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        quantityInput?.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 1) {
                e.target.value = 1;
            } else if (value > 99) {
                e.target.value = 99;
            }
        });
    }
    
    openModal(productId) {
        console.log('openModal called with productId:', productId);
        const product = this.productData[productId];
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }
        
        console.log('Product found:', product);
        this.currentProductId = productId;
        this.populateModal(product);
        this.showModal();
    }
    
    populateModal(product) {
        // Basic product info
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductImage').alt = product.name;
        document.getElementById('modalProductDescription').textContent = product.description;
        
        // Price
        document.getElementById('modalPriceCurrent').textContent = `$${product.currentPrice.toFixed(2)}`;
        const originalPriceEl = document.getElementById('modalPriceOriginal');
        if (product.originalPrice) {
            originalPriceEl.textContent = `$${product.originalPrice.toFixed(2)}`;
            originalPriceEl.style.display = 'inline';
        } else {
            originalPriceEl.style.display = 'none';
        }
        
        // Badge
        const badgeEl = document.getElementById('modalProductBadge');
        if (product.badge) {
            badgeEl.textContent = product.badge;
            badgeEl.className = `product-badge ${product.badge === 'New' ? '' : 'sale'}`;
            badgeEl.style.display = 'block';
        } else {
            badgeEl.style.display = 'none';
        }
        
        // Features
        const featuresList = document.getElementById('modalProductFeatures');
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        // Specifications
        const specsContainer = document.getElementById('modalProductSpecs');
        specsContainer.innerHTML = '';
        Object.entries(product.specs).forEach(([label, value]) => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            specItem.innerHTML = `
                <span class="spec-label">${label}:</span>
                <span class="spec-value">${value}</span>
            `;
            specsContainer.appendChild(specItem);
        });
        
        // Reset quantity
        document.getElementById('modalQuantity').value = 1;
    }
    
    showModal() {
        console.log('showModal called');
        console.log('Modal element:', this.modal);
        
        if (!this.modal) {
            console.error('Modal element not found!');
            return;
        }
        
        document.body.style.overflow = 'hidden';
        this.modal.classList.add('active');
        
        console.log('Modal classes after adding active:', this.modal.classList);
        
        // Focus trap for accessibility
        setTimeout(() => {
            this.modalClose?.focus();
        }, 300);
    }
    
    closeModal() {
        document.body.style.overflow = '';
        this.modal.classList.remove('active');
        this.currentProductId = null;
    }
    
    addToCart() {
        const quantity = parseInt(document.getElementById('modalQuantity').value);
        const product = this.productData[this.currentProductId];
        
        if (!product) return;
        
        // Create cart item
        const cartItem = {
            id: this.currentProductId,
            name: product.name,
            price: product.currentPrice,
            image: product.image,
            quantity: quantity
        };
        
        // Use existing cart functionality if available
        if (window.addToCartFunction) {
            window.addToCartFunction(cartItem);
        } else {
            // Fallback: trigger existing add to cart button
            const addToCartBtn = document.querySelector(`[data-product-id="${this.currentProductId}"]`);
            if (addToCartBtn && addToCartBtn.classList.contains('add-to-cart')) {
                // Set quantity in a temporary way and trigger click
                const originalQuantity = quantity;
                for (let i = 0; i < originalQuantity; i++) {
                    addToCartBtn.click();
                }
            }
        }
        
        // Show success message
        this.showMessage(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`, 'success');
        
        // Close modal after a short delay
        setTimeout(() => {
            this.closeModal();
        }, 1500);
    }
    
    viewFullDetails() {
        // Navigate to products page or specific product page
        window.location.href = `products.html?id=${this.currentProductId}`;
    }
    
    showMessage(text, type = 'info') {
        // Create or update message element
        let messageEl = document.getElementById('quickViewMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'quickViewMessage';
            messageEl.className = 'quick-view-message';
            
            const modalActions = document.querySelector('.modal-actions');
            if (modalActions) {
                modalActions.insertBefore(messageEl, modalActions.firstChild);
            }
        }
        
        messageEl.textContent = text;
        messageEl.className = `quick-view-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}

// Initialize Quick View when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quickViewModal = new QuickViewModal();
    console.log('Quick View Modal initialized');
});

// Add message styles
const messageStyles = `
<style>
.quick-view-message {
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-weight: 500;
    text-align: center;
    display: none;
    animation: slideInMessage 0.3s ease-out;
}

.quick-view-message.success {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
}

.quick-view-message.info {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #93c5fd;
}

.quick-view-message.error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fca5a5;
}

@keyframes slideInMessage {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`;

// Inject message styles
document.head.insertAdjacentHTML('beforeend', messageStyles);