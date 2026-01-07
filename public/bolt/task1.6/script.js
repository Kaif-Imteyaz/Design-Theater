// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    initializeUserTypeSwitcher();
    initializeCategoryFilters();
    initializeProductCards();
    initializeSearch();
    initializeCart();
    initializeAccessibilityFeatures();
    initializeMobileNavigation();
}

// User Type Switcher Functionality
function initializeUserTypeSwitcher() {
    const userTypeButtons = document.querySelectorAll('.user-type-btn');
    const contentPanels = document.querySelectorAll('.content-panel');
    
    userTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userType = this.dataset.type;
            
            // Update button states
            userTypeButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Show corresponding content
            contentPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            const targetPanel = document.getElementById(`${userType}-content`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            // Announce change to screen readers
            announceToScreenReader(`Switched to ${userType} view`);
        });
    });
}

// Category Filter Functionality
function initializeCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update button states
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            filterProducts(category);
            
            // Announce filter change
            const productCount = getVisibleProductCount();
            announceToScreenReader(`Showing ${productCount} products in ${category === 'all' ? 'all categories' : category}`);
        });
    });
}

// Filter products based on category
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const productBadge = card.querySelector('.product-badge');
            if (productBadge) {
                const productCategory = productBadge.textContent.toLowerCase();
                const matchesCategory = 
                    (category === 'handmade' && productCategory === 'handmade') ||
                    (category === 'vintage' && productCategory === 'vintage') ||
                    (category === 'produce' && productCategory === 'fresh') ||
                    (category === 'jewelry' && card.querySelector('.product-title').textContent.toLowerCase().includes('necklace'));
                
                card.style.display = matchesCategory ? 'block' : 'none';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Get count of visible products
function getVisibleProductCount() {
    const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])');
    return visibleProducts.length;
}

// Initialize product card interactions
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add click handler for card navigation
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on add to cart button
            if (!e.target.classList.contains('add-to-cart-btn')) {
                const productTitle = this.querySelector('.product-title').textContent;
                console.log(`Navigating to product: ${productTitle}`);
                // In a real app, this would navigate to the product detail page
                announceToScreenReader(`Viewing ${productTitle}`);
            }
        });
        
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(this);
        });
    });
}

// Add to cart functionality
function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productTitle = productCard.querySelector('.product-title').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    
    // Visual feedback
    button.textContent = 'Added!';
    button.style.backgroundColor = '#28a745';
    
    // Update cart count
    updateCartCount();
    
    // Announce to screen readers
    announceToScreenReader(`${productTitle} added to cart`);
    
    // Reset button after delay
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.backgroundColor = '';
    }, 2000);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const currentCount = parseInt(cartCount.textContent) || 0;
    cartCount.textContent = currentCount + 1;
    
    // Add animation to cart count
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 300);
}

// Search functionality
function initializeSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch(searchInput.value);
    });
    
    // Real-time search suggestions (debounced)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.value.length > 2) {
                showSearchSuggestions(this.value);
            } else {
                hideSearchSuggestions();
            }
        }, 300);
    });
}

// Perform search
function performSearch(query) {
    if (!query.trim()) return;
    
    console.log(`Searching for: ${query}`);
    announceToScreenReader(`Searching for ${query}`);
    
    // In a real app, this would make an API call
    // For demo purposes, we'll filter existing products
    const productCards = document.querySelectorAll('.product-card');
    let matchCount = 0;
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const seller = card.querySelector('.seller-name').textContent.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        if (title.includes(searchTerm) || seller.includes(searchTerm)) {
            card.style.display = 'block';
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    announceToScreenReader(`Found ${matchCount} products matching ${query}`);
}

// Show search suggestions (placeholder)
function showSearchSuggestions(query) {
    // In a real app, this would show dropdown suggestions
    console.log(`Showing suggestions for: ${query}`);
}

// Hide search suggestions
function hideSearchSuggestions() {
    // In a real app, this would hide dropdown suggestions
    console.log('Hiding search suggestions');
}

// Initialize cart functionality
function initializeCart() {
    const cartLink = document.querySelector('.cart-link');
    
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });
}

// Open cart (placeholder)
function openCart() {
    announceToScreenReader('Opening shopping cart');
    console.log('Opening cart modal');
    // In a real app, this would open a cart modal or navigate to cart page
}

// Accessibility features
function initializeAccessibilityFeatures() {
    // Add skip links functionality
    const skipLink = document.querySelector('.skip-link');
    skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals or reset filters
        if (e.key === 'Escape') {
            resetFilters();
        }
        
        // Arrow key navigation for product grid
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            handleArrowKeyNavigation(e);
        }
    });
    
    // Focus management for dynamic content
    setupFocusManagement();
}

// Handle arrow key navigation
function handleArrowKeyNavigation(e) {
    const focusedElement = document.activeElement;
    const productCards = Array.from(document.querySelectorAll('.product-card:not([style*="display: none"])'));
    const currentIndex = productCards.indexOf(focusedElement);
    
    if (currentIndex === -1) return;
    
    let newIndex;
    const cardsPerRow = getCardsPerRow();
    
    switch (e.key) {
        case 'ArrowRight':
            newIndex = Math.min(currentIndex + 1, productCards.length - 1);
            break;
        case 'ArrowLeft':
            newIndex = Math.max(currentIndex - 1, 0);
            break;
        case 'ArrowDown':
            newIndex = Math.min(currentIndex + cardsPerRow, productCards.length - 1);
            break;
        case 'ArrowUp':
            newIndex = Math.max(currentIndex - cardsPerRow, 0);
            break;
        default:
            return;
    }
    
    if (newIndex !== currentIndex) {
        e.preventDefault();
        productCards[newIndex].focus();
    }
}

// Calculate cards per row for arrow navigation
function getCardsPerRow() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return 4;
    
    const gridStyles = window.getComputedStyle(productGrid);
    const gridColumns = gridStyles.getPropertyValue('grid-template-columns');
    
    // Count the number of column definitions
    return gridColumns.split(' ').length || 4;
}

// Setup focus management
function setupFocusManagement() {
    // Focus first product when switching to customer view
    const customerBtn = document.querySelector('.user-type-btn[data-type="customer"]');
    customerBtn.addEventListener('click', function() {
        setTimeout(() => {
            const firstProduct = document.querySelector('.product-card:not([style*="display: none"])');
            if (firstProduct) {
                firstProduct.focus();
            }
        }, 100);
    });
}

// Reset all filters
function resetFilters() {
    // Reset category filter
    const allCategoryBtn = document.querySelector('.category-btn[data-category="all"]');
    if (allCategoryBtn) {
        allCategoryBtn.click();
    }
    
    // Clear search
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
        performSearch('');
    }
    
    announceToScreenReader('Filters reset, showing all products');
}

// Mobile navigation enhancements
function initializeMobileNavigation() {
    // Touch-friendly interactions
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback for buttons
        const buttons = document.querySelectorAll('button, .cta-button, .product-card');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }
    
    // Responsive navigation adjustments
    window.addEventListener('resize', function() {
        adjustNavigationForScreen();
    });
    
    adjustNavigationForScreen();
}

// Adjust navigation based on screen size
function adjustNavigationForScreen() {
    const isMobile = window.innerWidth < 768;
    const userNav = document.querySelector('.user-nav');
    
    if (isMobile) {
        userNav.classList.add('mobile');
        // Simplify navigation for mobile
        const navTexts = document.querySelectorAll('.nav-text');
        navTexts.forEach(text => {
            text.style.display = 'none';
        });
    } else {
        userNav.classList.remove('mobile');
        const navTexts = document.querySelectorAll('.nav-text');
        navTexts.forEach(text => {
            text.style.display = 'block';
        });
    }
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Error handling for failed operations
function handleError(operation, error) {
    console.error(`Error in ${operation}:`, error);
    announceToScreenReader(`Sorry, there was an error with ${operation}. Please try again.`);
}

// Performance optimization - Lazy loading for images
function setupLazyLoading() {
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
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Service worker registration for offline functionality (placeholder)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // In a production app, register service worker here
        console.log('Service worker support detected');
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    console.log(`Tracking event: ${eventName}`, eventData);
    // In a real app, this would send data to analytics service
}

// Track user interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('product-card') || e.target.closest('.product-card')) {
        trackEvent('product_view', {
            product: e.target.querySelector('.product-title')?.textContent || 'unknown'
        });
    }
    
    if (e.target.classList.contains('add-to-cart-btn')) {
        trackEvent('add_to_cart', {
            product: e.target.closest('.product-card').querySelector('.product-title').textContent
        });
    }
});