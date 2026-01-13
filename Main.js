// IndusRoboTix - Main Application
class IndusRoboTixApp {
    constructor() {
        // Application State
        this.state = {
            products: [],
            filteredProducts: [],
            cart: [],
            currentView: 'grid',
            currentCategory: 'all',
            currentSort: 'newest',
            currentPage: 1,
            itemsPerPage: 12,
            searchQuery: '',
            activeFilters: {},
            theme: 'dark',
            isLoading: true
        };
        
        // Configuration
        this.config = window.IndusRoboTixConfig || {};
        this.productsData = window.IndusRoboTixProducts || { products: [] };
        
        // DOM Elements cache
        this.elements = {};
        
        // Initialize
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing IndusRoboTix...');
        
        try {
            // Cache DOM elements
            this.cacheElements();
            
            // Show loading
            this.showLoading();
            
            // Load products
            await this.loadProducts();
            
            // Initialize UI
            this.initUI();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Apply filters and render
            this.applyFilters();
            this.renderAll();
            
            // Hide loading
            setTimeout(() => {
                this.hideLoading();
                console.log('✅ IndusRoboTix initialized successfully!');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }
    
    cacheElements() {
        // Cache frequently used elements
        this.elements = {
            // Main containers
            productsContainer: document.getElementById('products-container'),
            categoryFilter: document.getElementById('category-filter'),
            sortFilter: document.getElementById('sort-filter'),
            searchInput: document.getElementById('search-input'),
            productsCount: document.getElementById('products-count'),
            
            // Controls
            viewButtons: document.querySelectorAll('.view-btn'),
            themeToggle: document.getElementById('theme-toggle'),
            cartToggle: document.getElementById('cart-toggle'),
            cartCount: document.getElementById('cart-count'),
            
            // Sections
            newProducts: document.getElementById('new-products'),
            announcementBanner: document.getElementById('announcement-banner'),
            announcementText: document.getElementById('announcement-text'),
            
            // Stats
            totalKits: document.getElementById('total-kits'),
            newKits: document.getElementById('new-kits'),
            
            // Footer
            currentYear: document.getElementById('current-year')
        };
    }
    
    async loadProducts() {
        try {
            // Use the embedded products data
            this.state.products = this.productsData.products || [];
            
            // Mark new products
            this.markNewProducts();
            
            console.log(`📦 Loaded ${this.state.products.length} products`);
            
            // Update stats
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to sample data
            this.state.products = this.getSampleProducts();
        }
    }
    
    markNewProducts() {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - 30);
        
        this.state.products.forEach(product => {
            if (product.launchInfo && product.launchInfo.launchDate) {
                const launchDate = new Date(product.launchInfo.launchDate);
                product.launchInfo.isNew = launchDate >= thresholdDate;
            }
        });
    }
    
    getSampleProducts() {
        // Fallback sample data
        return [
            {
                id: 'IR-001',
                name: '2WD Alpha Module (I) - Foundation Kit',
                description: 'Beginner robotics kit',
                category: 'main',
                pricing: { finalPrice: 1300 },
                launchInfo: { isNew: true },
                features: ['Beginner Friendly', 'Made in Pakistan']
            }
        ];
    }
    
    updateStats() {
        if (this.elements.totalKits) {
            this.elements.totalKits.textContent = this.state.products.length;
        }
        
        if (this.elements.newKits) {
            const newCount = this.state.products.filter(p => p.launchInfo?.isNew).length;
            this.elements.newKits.textContent = newCount;
        }
    }
    
    initUI() {
        // Apply theme
        const savedTheme = localStorage.getItem('indusrobotix_theme') || this.config.website?.defaultTheme || 'dark';
        this.applyTheme(savedTheme);
        
        // Initialize filters
        this.initCategoryFilter();
        this.initSortFilter();
        
        // Initialize view toggle
        this.initViewToggle();
        
        // Update footer year
        if (this.elements.currentYear) {
            this.elements.currentYear.textContent = new Date().getFullYear();
        }
    }
    
    initCategoryFilter() {
        const filter = this.elements.categoryFilter;
        if (!filter) return;
        
        const categories = this.config.categories || [
            { id: 'all', name: 'All Kits' },
            { id: 'main', name: 'Main Modules' },
            { id: 'extension', name: 'Extension Kits' },
            { id: 'new', name: 'New Arrivals' }
        ];
        
        filter.innerHTML = categories.map(cat => `
            <option value="${cat.id}">${cat.name}</option>
        `).join('');
        
        filter.value = this.state.currentCategory;
    }
    
    initSortFilter() {
        const filter = this.elements.sortFilter;
        if (!filter) return;
        
        const sortOptions = this.config.sortOptions || [
            { id: 'newest', name: 'Newest First' },
            { id: 'price-low', name: 'Price: Low to High' },
            { id: 'price-high', name: 'Price: High to Low' }
        ];
        
        filter.innerHTML = sortOptions.map(opt => `
            <option value="${opt.id}">${opt.name}</option>
        `).join('');
        
        filter.value = this.state.currentSort;
    }
    
    initViewToggle() {
        this.elements.viewButtons?.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.state.currentView);
        });
        
        if (this.elements.productsContainer) {
            this.elements.productsContainer.className = `products-${this.state.currentView}-view`;
        }
    }
    
    setupEventListeners() {
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Cart toggle
        if (this.elements.cartToggle) {
            this.elements.cartToggle.addEventListener('click', () => this.toggleCart());
        }
        
        // Search input
        if (this.elements.searchInput) {
            let searchTimeout;
            this.elements.searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
            
            // Clear search button
            const clearBtn = document.getElementById('clear-search');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.elements.searchInput.value = '';
                    this.handleSearch('');
                });
            }
        }
        
        // Category filter
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.addEventListener('change', (e) => {
                this.handleCategoryChange(e.target.value);
            });
        }
        
        // Sort filter
        if (this.elements.sortFilter) {
            this.elements.sortFilter.addEventListener('change', (e) => {
                this.handleSortChange(e.target.value);
            });
        }
        
        // View toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const button = e.target.closest('.view-btn');
                const view = button.dataset.view;
                this.handleViewChange(view);
            }
            
            // Product action buttons
            if (e.target.closest('.action-btn')) {
                const button = e.target.closest('.action-btn');
                const productId = button.dataset.productId;
                const action = button.dataset.action;
                
                if (action === 'details') {
                    this.showProductDetails(productId);
                } else if (action === 'cart') {
                    this.addToCart(productId);
                }
            }
        });
        
        // Close cart
        const closeCartBtn = document.querySelector('.close-cart');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.toggleCart());
        }
    }
    
    // Filtering and Sorting
    applyFilters() {
        let filtered = [...this.state.products];
        
        // Apply category filter
        if (this.state.currentCategory !== 'all') {
            filtered = this.filterByCategory(filtered, this.state.currentCategory);
        }
        
        // Apply search filter
        if (this.state.searchQuery.trim()) {
            filtered = this.filterBySearch(filtered, this.state.searchQuery);
        }
        
        // Apply sorting
        filtered = this.sortProducts(filtered, this.state.currentSort);
        
        this.state.filteredProducts = filtered;
        this.updateProductsCount();
    }
    
    filterByCategory(products, category) {
        if (category === 'new') {
            return products.filter(p => p.launchInfo?.isNew);
        } else if (category === 'starter') {
            return products.filter(p => p.tags?.includes('starter'));
        } else {
            return products.filter(p => p.category === category);
        }
    }
    
    filterBySearch(products, query) {
        const searchTerm = query.toLowerCase();
        return products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchTerm) ||
                product.description?.toLowerCase().includes(searchTerm) ||
                product.specialty?.toLowerCase().includes(searchTerm) ||
                product.features?.some(f => f.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch(sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.pricing.finalPrice - b.pricing.finalPrice);
            case 'price-high':
                return sorted.sort((a, b) => b.pricing.finalPrice - a.pricing.finalPrice);
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
            default:
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.launchInfo?.launchDate || 0);
                    const dateB = new Date(b.launchInfo?.launchDate || 0);
                    return dateB - dateA;
                });
        }
    }
    
    // Event Handlers
    handleSearch(query) {
        this.state.searchQuery = query;
        this.state.currentPage = 1;
        this.applyFilters();
        this.renderProducts();
    }
    
    handleCategoryChange(category) {
        this.state.currentCategory = category;
        this.state.currentPage = 1;
        this.applyFilters();
        this.renderProducts();
    }
    
    handleSortChange(sortBy) {
        this.state.currentSort = sortBy;
        this.applyFilters();
        this.renderProducts();
    }
    
    handleViewChange(view) {
        this.state.currentView = view;
        
        // Update active button
        this.elements.viewButtons?.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update container class
        if (this.elements.productsContainer) {
            this.elements.productsContainer.className = `products-${view}-view`;
        }
        
        this.renderProducts();
    }
    
    // Rendering
    renderAll() {
        this.renderProducts();
        this.renderNewProducts();
        this.renderAnnouncement();
    }
    
    renderProducts() {
        const container = this.elements.productsContainer;
        if (!container) return;
        
        const products = this.state.filteredProducts;
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        const paginated = products.slice(start, end);
        
        // Clear container
        container.innerHTML = '';
        
        if (paginated.length === 0) {
            container.innerHTML = this.getNoProductsHTML();
            return;
        }
        
        // Add products based on current view
        paginated.forEach(product => {
            const productElement = this.createProductElement(product);
            container.appendChild(productElement);
        });
        
        // Render pagination
        this.renderPagination();
    }
    
    createProductElement(product) {
        const isNew = product.launchInfo?.isNew;
        const isMadeInPakistan = product.inventory?.madeInPakistan;
        
        const div = document.createElement('div');
        div.className = `product-card ${isNew ? 'new-product' : ''}`;
        
        div.innerHTML = `
            <div class="product-badges">
                ${isNew ? '<span class="badge new">NEW</span>' : ''}
                ${isMadeInPakistan ? '<span class="badge category">🇵🇰 PAKISTAN</span>' : ''}
            </div>
            
            <div class="product-image">
                <i class="fas fa-robot"></i>
                <button class="quick-view-btn" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || product.specialty}</p>
                
                <div class="product-features">
                    ${product.features ? product.features.slice(0, 3).map(f => 
                        `<span class="feature-tag">${f}</span>`
                    ).join('') : ''}
                </div>
                
                <div class="product-price">
                    <span class="currency-symbol">₨</span>
                    <span class="final-price">${product.pricing?.finalPrice || 0}</span>
                </div>
                
                <div class="product-actions">
                    <button class="action-btn details" data-product-id="${product.id}" data-action="details">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="action-btn cart" data-product-id="${product.id}" data-action="cart">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        return div;
    }
    
    getNoProductsHTML() {
        return `
            <div class="no-products">
                <i class="fas fa-robot"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search criteria</p>
                <button class="btn btn-primary" onclick="app.resetFilters()">
                    Reset Filters
                </button>
            </div>
        `;
    }
    
    renderNewProducts() {
        const container = this.elements.newProducts;
        if (!container) return;
        
        const newProducts = this.state.products
            .filter(p => p.launchInfo?.isNew)
            .slice(0, 3);
        
        if (newProducts.length === 0) {
            container.innerHTML = '<p>No new products recently.</p>';
            return;
        }
        
        container.innerHTML = newProducts.map(product => `
            <div class="product-card">
                <div class="product-badges">
                    <span class="badge new">NEW</span>
                </div>
                <div class="product-image">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>${product.specialty}</p>
                    <div class="product-price">₨${product.pricing?.finalPrice || 0}</div>
                </div>
            </div>
        `).join('');
    }
    
    renderAnnouncement() {
        const banner = this.elements.announcementBanner;
        const text = this.elements.announcementText;
        
        if (!banner || !text) return;
        
        const newProducts = this.state.products.filter(p => p.launchInfo?.isNew);
        
        if (newProducts.length > 0) {
            banner.style.display = 'block';
            text.textContent = `🎉 ${newProducts.length} new kit${newProducts.length > 1 ? 's' : ''} added! Explore our latest robotics kits.`;
        } else {
            banner.style.display = 'none';
        }
    }
    
    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        const totalProducts = this.state.filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / this.state.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = `
            <button class="pagination-btn" ${this.state.currentPage === 1 ? 'disabled' : ''} 
                    onclick="app.goToPage(${this.state.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button class="pagination-btn ${i === this.state.currentPage ? 'active' : ''}" 
                        onclick="app.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        html += `
            <button class="pagination-btn" ${this.state.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="app.goToPage(${this.state.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        container.innerHTML = html;
    }
    
    updateProductsCount() {
        const element = this.elements.productsCount;
        if (!element) return;
        
        const total = this.state.filteredProducts.length;
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage + 1;
        const end = Math.min(start + this.state.itemsPerPage - 1, total);
        
        element.innerHTML = total === 0 ? 
            'No products found' :
            `Showing <span class="highlight">${start}-${end}</span> of <span class="highlight">${total}</span> kits`;
    }
    
    // Utility Methods
    goToPage(page) {
        if (page < 1 || page > Math.ceil(this.state.filteredProducts.length / this.state.itemsPerPage)) {
            return;
        }
        
        this.state.currentPage = page;
        this.renderProducts();
        
        // Scroll to products section
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    resetFilters() {
        this.state.currentCategory = 'all';
        this.state.currentSort = 'newest';
        this.state.searchQuery = '';
        this.state.currentPage = 1;
        
        // Reset UI elements
        if (this.elements.searchInput) this.elements.searchInput.value = '';
        if (this.elements.categoryFilter) this.elements.categoryFilter.value = 'all';
        if (this.elements.sortFilter) this.elements.sortFilter.value = 'newest';
        
        this.applyFilters();
        this.renderAll();
        
        this.showNotification('All filters have been reset', 'info');
    }
    
    // Theme Management
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.state.theme = theme;
        
        // Update toggle button icon
        if (this.elements.themeToggle) {
            this.elements.themeToggle.innerHTML = theme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
        
        // Save preference
        localStorage.setItem('indusrobotix_theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
    
    // Cart Management
    addToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;
        
        // Check if already in cart
        const existingItem = this.state.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({
                id: productId,
                product: product,
                quantity: 1,
                addedAt: new Date()
            });
        }
        
        // Update cart count
        this.updateCartCount();
        
        // Show notification
        this.showNotification(`${product.name} added to cart!`, 'success');
        
        // Open cart sidebar
        this.toggleCart();
    }
    
    updateCartCount() {
        const badge = this.elements.cartCount;
        if (!badge) return;
        
        const count = this.state.cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        if (!sidebar) return;
        
        sidebar.classList.toggle('open');
        
        // Update cart display
        this.updateCartDisplay();
    }
    
    updateCartDisplay() {
        const container = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        
        if (!container || !totalElement) return;
        
        if (this.state.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            totalElement.textContent = '₨0';
            return;
        }
        
        let total = 0;
        
        container.innerHTML = this.state.cart.map(item => {
            const itemTotal = item.product.pricing.finalPrice * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.product.name}</h4>
                        <p>₨${item.product.pricing.finalPrice} × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-total">₨${itemTotal}</div>
                </div>
            `;
        }).join('');
        
        totalElement.textContent = `₨${total}`;
    }
    
    // Product Details
    showProductDetails(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;
        
        const details = `
Product: ${product.name}
Price: ₨${product.pricing?.finalPrice || 0}
Category: ${product.category}
${product.description ? `\nDescription: ${product.description}` : ''}
${product.features ? `\nFeatures: ${product.features.join(', ')}` : ''}
${product.inventory?.madeInPakistan ? '\n✅ Made in Pakistan' : ''}
        `.trim();
        
        alert(details);
    }
    
    // Notifications
    showNotification(message, type = 'info') {
        // Create or get notification container
        let container = document.getElementById('notification-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            background: ${type === 'success' ? '#01411C' : type === 'error' ? '#dc3545' : '#2C3E50'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }
    
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

// Add notification styles
const notificationStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.no-products {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
}

.no-products i {
    font-size: 3rem;
    margin-bottom: 20px;
    opacity: 0.5;
}

.no-products h3 {
    margin-bottom: 10px;
    color: var(--text-primary);
}

.empty-cart {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
}

.empty-cart i {
    font-size: 2rem;
    margin-bottom: 10px;
    opacity: 0.5;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: var(--bg-card);
    border-radius: 8px;
    margin-bottom: 8px;
    border: 1px solid var(--border-color);
}

.cart-item-info h4 {
    margin: 0 0 4px 0;
    font-size: 0.95rem;
}

.cart-item-info p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.cart-item-total {
    font-weight: bold;
    color: var(--secondary-color);
}
`;

// Inject styles
const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new IndusRoboTixApp();
    window.app = app; // Make available globally for button onclick handlers
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    if (app) {
        app.showError('An unexpected error occurred. Please refresh the page.');
    }
});
