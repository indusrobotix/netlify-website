/**
 * WD Alpha Robotics - Main Application Controller
 * Orchestrates all components and manages application state
 * Last Updated: 2024-12-14
 */

// ============================================
// GLOBAL STATE & VARIABLES
// ============================================
class WDAlphaApp {
    constructor() {
        // Application state
        this.state = {
            products: [],
            filteredProducts: [],
            categories: [],
            currentView: 'grid',
            currentCategory: 'all',
            currentSort: 'newest',
            currentPage: 1,
            itemsPerPage: 12,
            searchQuery: '',
            activeFilters: {},
            selectedProducts: [], // For comparison
            cart: [],
            theme: 'dark',
            isLoading: true,
            userPreferences: {}
        };
        
        // References to managers
        this.recentLaunchesManager = null;
        this.cartManager = null;
        
        // DOM Elements cache
        this.elements = {};
        
        // Initialize application
        this.init();
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    async init() {
        try {
            // Show loading overlay
            this.showLoading();
            
            // Load configuration
            await this.loadConfig();
            
            // Load product data
            await this.loadProducts();
            
            // Initialize managers
            this.initManagers();
            
            // Initialize UI
            this.initUI();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Apply user preferences
            this.applyUserPreferences();
            
            // Hide loading
            this.hideLoading();
            
            // Initial render
            this.renderAll();
            
            // Track page view
            this.trackPageView();
            
            console.log('WD Alpha App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }
    
    // ============================================
    // DATA LOADING
    // ============================================
    async loadConfig() {
        // Configuration is loaded via config.js script tag
        // Verify it's available
        if (typeof WD_CONFIG === 'undefined') {
            console.warn('Configuration not found, using defaults');
            window.WD_CONFIG = {
                website: {
                    productsPerPage: 12,
                    defaultTheme: 'dark',
                    defaultCurrency: 'INR'
                }
            };
        }
        
        // Apply config to state
        this.state.itemsPerPage = WD_CONFIG.website.productsPerPage || 12;
        this.state.theme = localStorage.getItem('wdalpha_theme') || 
                          WD_CONFIG.website.defaultTheme || 
                          'dark';
    }
    
    async loadProducts() {
        try {
            // Try to fetch from JSON file
            const response = await fetch('products-data.json');
            const data = await response.json();
            
            this.state.products = data.products || [];
            this.state.categories = data.categories || [];
            
            // Store in global for other modules
            window.PRODUCTS_DATA = data;
            
            console.log(`Loaded ${this.state.products.length} products`);
        } catch (error) {
            console.error('Failed to load products data:', error);
            
            // Fallback: Use embedded data or show error
            this.showNotification('Using sample data. Product file not found.', 'warning');
            
            // You could load a minimal dataset here
            this.state.products = this.getSampleProducts();
            this.state.categories = [
                { id: 'main', name: 'Main Modules' },
                { id: 'extension', name: 'Extension Modules' }
            ];
        }
    }
    
    getSampleProducts() {
        // Minimal sample data for fallback
        return [
            {
                id: 'WD-001',
                name: 'WD Alpha Module (I)',
                specialty: 'Robot Chassis Kit',
                category: 'main',
                pricing: { finalPrice: 1300 },
                launchInfo: { launchDate: '2023-01-15', isNew: false },
                features: ['Base Structure', 'Upgradeable']
            }
        ];
    }
    
    // ============================================
    // MANAGER INITIALIZATION
    // ============================================
    initManagers() {
        // Initialize Recent Launches Manager
        if (typeof RecentLaunchesManager !== 'undefined') {
            this.recentLaunchesManager = RecentLaunchesManager.getInstance();
            this.recentLaunchesManager.initialize(
                { products: this.state.products },
                {
                    recentDaysThreshold: WD_CONFIG.website.recentLaunchDays || 30,
                    highlightNewBadge: true,
                    showAnnouncementBanner: true
                }
            );
        }
        
        // Initialize Cart Manager (if exists)
        if (typeof CartManager !== 'undefined') {
            this.cartManager = CartManager.getInstance();
            this.cartManager.initialize(this.state.products);
            this.state.cart = this.cartManager.getCart();
        }
        
        // Initialize other managers as needed
        // Example: AnalyticsManager, UserManager, etc.
    }
    
    // ============================================
    // UI INITIALIZATION
    // ============================================
    initUI() {
        // Cache DOM elements
        this.cacheElements();
        
        // Apply theme
        this.applyTheme(this.state.theme);
        
        // Initialize components
        this.initCategoryFilters();
        this.initSortOptions();
        this.initViewToggle();
        
        // Update UI state
        this.updateProductCount();
        this.updateCartBadge();
        this.updateNewProductsBadge();
    }
    
    cacheElements() {
        this.elements = {
            // Containers
            productsContainer: document.getElementById('products-container'),
            categoryFilters: document.getElementById('category-filters'),
            sortSelect: document.getElementById('sort-select'),
            searchInput: document.getElementById('search-input'),
            productCount: document.getElementById('product-count'),
            
            // Controls
            viewButtons: document.querySelectorAll('.view-btn'),
            resetFiltersBtn: document.getElementById('reset-filters'),
            themeToggle: document.getElementById('theme-toggle'),
            cartButton: document.getElementById('cart-button'),
            cartCount: document.getElementById('cart-count'),
            
            // Sections
            recentProductsContainer: document.getElementById('recent-products'),
            announcementBanner: document.getElementById('announcement-banner'),
            announcementText: document.getElementById('announcement-text'),
            
            // Modals
            cartSidebar: document.getElementById('cart-sidebar'),
            comparisonModal: document.getElementById('comparison-modal'),
            quickviewModal: document.getElementById('quickview-modal'),
            
            // Footer
            currentYear: document.getElementById('current-year'),
            currencyDisplay: document.getElementById('currency-display')
        };
    }
    
    // ============================================
    // RENDERING FUNCTIONS
    // ============================================
    renderAll() {
        // Apply filters and sorting
        this.applyFilters();
        
        // Render main products
        this.renderProducts();
        
        // Render recent launches
        this.renderRecentLaunches();
        
        // Render announcement
        this.renderAnnouncement();
        
        // Update pagination
        this.renderPagination();
        
        // Update footer
        this.updateFooter();
    }
    
    renderProducts() {
        const container = this.elements.productsContainer;
        if (!container) return;
        
        const products = this.state.filteredProducts;
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);
        
        // Clear container
        container.innerHTML = '';
        
        if (paginatedProducts.length === 0) {
            container.innerHTML = this.getNoProductsHTML();
            return;
        }
        
        // Add products based on current view
        paginatedProducts.forEach(product => {
            const productElement = this.createProductElement(product);
            container.appendChild(productElement);
        });
        
        // Add animations
        this.animateProductCards();
    }
    
    createProductElement(product) {
        const isNew = this.recentLaunchesManager ? 
            this.recentLaunchesManager.isProductNew(product.id) : 
            (product.launchInfo?.isNew || false);
        
        const card = document.createElement('div');
        card.className = `product-card ${isNew ? 'new-product' : ''}`;
        card.dataset.id = product.id;
        card.dataset.category = product.category;
        
        // Generate card HTML
        card.innerHTML = `
            <div class="product-badges">
                ${isNew ? '<span class="badge new-badge"><i class="fas fa-star"></i> NEW</span>' : ''}
                ${product.category === 'main' ? 
                    '<span class="badge category-badge">Full Kit</span>' : 
                    '<span class="badge category-badge secondary">Add-on</span>'
                }
            </div>
            
            <div class="product-image">
                <div class="image-container">
                    <i class="fas fa-robot placeholder-icon"></i>
                </div>
                <button class="quick-view-btn" title="Quick View" data-id="${product.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="compare-checkbox" title="Add to Compare" data-id="${product.id}">
                    <i class="far fa-square"></i>
                </button>
            </div>
            
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-specialty">${product.specialty}</p>
                
                <div class="product-meta">
                    <span class="meta-item">
                        <i class="fas fa-calendar"></i>
                        ${product.launchInfo?.launchDate ? 
                            new Date(product.launchInfo.launchDate).toLocaleDateString('en-IN') : 
                            'N/A'
                        }
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-cube"></i>
                        ${product.category === 'main' ? 'Main Kit' : 'Extension'}
                    </span>
                </div>
                
                <div class="product-features">
                    ${product.features ? 
                        product.features.slice(0, 3).map(f => 
                            `<span class="feature-tag">${f}</span>`
                        ).join('') : ''
                    }
                </div>
                
                <div class="price-section">
                    <div class="final-price">₹${product.pricing?.finalPrice || 0}</div>
                    ${WD_CONFIG.productDisplay?.showPriceBreakdown ? `
                        <div class="price-breakdown">
                            <small>Component: ₹${product.pricing?.componentPrice || 0}</small>
                        </div>
                    ` : ''}
                </div>
                
                <div class="product-actions">
                    <button class="details-btn" data-id="${product.id}">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    getNoProductsHTML() {
        return `
            <div class="no-products-found">
                <div class="no-products-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3>No Products Found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button id="reset-all-filters" class="primary-btn">
                    <i class="fas fa-redo"></i> Reset All Filters
                </button>
            </div>
        `;
    }
    
    renderRecentLaunches() {
        const container = this.elements.recentProductsContainer;
        if (!container || !this.recentLaunchesManager) return;
        
        const recentLaunches = this.recentLaunchesManager.getRecentLaunches();
        if (!recentLaunches) return;
        
        const html = recentLaunches.generateRecentProductsHTML(4);
        container.innerHTML = html;
        
        // Update new products count badge
        const badge = document.getElementById('new-count-badge');
        if (badge) {
            const count = recentLaunches.getNewProductsCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    renderAnnouncement() {
        const banner = this.elements.announcementBanner;
        const text = this.elements.announcementText;
        
        if (!banner || !text || !this.recentLaunchesManager) return;
        
        const recentLaunches = this.recentLaunchesManager.getRecentLaunches();
        if (!recentLaunches) return;
        
        const announcements = recentLaunches.generateAnnouncement();
        
        if (announcements && announcements.length > 0) {
            const announcement = announcements[0];
            text.textContent = announcement.message;
            banner.style.display = 'block';
            
            // Add priority class
            if (announcement.priority === 'urgent') {
                banner.classList.add('urgent');
            }
        } else {
            banner.style.display = 'none';
        }
    }
    
    renderPagination() {
        const totalProducts = this.state.filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / this.state.itemsPerPage);
        
        if (totalPages <= 1) {
            // Hide pagination if only one page
            const paginationContainer = document.getElementById('pagination-container');
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            return;
        }
        
        // Generate pagination HTML
        let html = `
            <button class="pagination-btn prev" ${this.state.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Prev
            </button>
        `;
        
        // Show page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= this.state.currentPage - 2 && i <= this.state.currentPage + 2)
            ) {
                html += `
                    <button class="pagination-number ${i === this.state.currentPage ? 'active' : ''}" 
                            data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (
                i === this.state.currentPage - 3 || 
                i === this.state.currentPage + 3
            ) {
                html += `<span class="pagination-dots">...</span>`;
            }
        }
        
        html += `
            <button class="pagination-btn next" ${this.state.currentPage === totalPages ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        const container = document.getElementById('pagination-container');
        if (container) {
            container.innerHTML = html;
            container.style.display = 'flex';
        }
    }
    
    // ============================================
    // FILTERING & SORTING
    // ============================================
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
        
        // Apply price filter
        if (this.state.activeFilters.priceRange) {
            filtered = this.filterByPrice(
                filtered, 
                this.state.activeFilters.priceRange.min, 
                this.state.activeFilters.priceRange.max
            );
        }
        
        // Apply sorting
        filtered = this.sortProducts(filtered, this.state.currentSort);
        
        this.state.filteredProducts = filtered;
        this.updateProductCount();
    }
    
    filterByCategory(products, category) {
        if (category === 'new') {
            return products.filter(p => p.launchInfo?.isNew);
        } else if (category === 'premium') {
            return products.filter(p => p.pricing?.finalPrice > 4000);
        } else {
            return products.filter(p => p.category === category);
        }
    }
    
    filterBySearch(products, query) {
        const searchTerm = query.toLowerCase();
        return products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchTerm) ||
                product.specialty.toLowerCase().includes(searchTerm) ||
                product.description?.toLowerCase().includes(searchTerm) ||
                product.features?.some(f => f.toLowerCase().includes(searchTerm)) ||
                product.tags?.some(t => t.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    filterByPrice(products, min, max) {
        return products.filter(product => {
            const price = product.pricing?.finalPrice || 0;
            return price >= min && price <= max;
        });
    }
    
    sortProducts(products, sortType) {
        const sorted = [...products];
        
        switch (sortType) {
            case 'newest':
                return sorted.sort((a, b) => 
                    new Date(b.launchInfo?.launchDate || 0) - 
                    new Date(a.launchInfo?.launchDate || 0)
                );
            case 'price-asc':
                return sorted.sort((a, b) => 
                    (a.pricing?.finalPrice || 0) - (b.pricing?.finalPrice || 0)
                );
            case 'price-desc':
                return sorted.sort((a, b) => 
                    (b.pricing?.finalPrice || 0) - (a.pricing?.finalPrice || 0)
                );
            case 'name-asc':
                return sorted.sort((a, b) => 
                    a.name.localeCompare(b.name)
                );
            case 'name-desc':
                return sorted.sort((a, b) => 
                    b.name.localeCompare(a.name)
                );
            case 'popular':
                return sorted.sort((a, b) => 
                    (b.launchInfo?.popularity || 0) - (a.launchInfo?.popularity || 0)
                );
            default:
                return sorted;
        }
    }
    
    // ============================================
    // UI UPDATES
    // ============================================
    updateProductCount() {
        const element = this.elements.productCount;
        if (!element) return;
        
        const total = this.state.filteredProducts.length;
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage + 1;
        const end = Math.min(start + this.state.itemsPerPage - 1, total);
        
        element.innerHTML = total === 0 ? 
            'No products found' :
            `Showing <span class="highlight-count">${start}-${end}</span> of <span class="highlight-count">${total}</span> products`;
    }
    
    updateCartBadge() {
        const badge = this.elements.cartCount;
        if (!badge) return;
        
        const count = this.state.cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    updateNewProductsBadge() {
        if (!this.recentLaunchesManager) return;
        
        const recentLaunches = this.recentLaunchesManager.getRecentLaunches();
        if (!recentLaunches) return;
        
        const count = recentLaunches.getNewProductsCount();
        const badge = document.getElementById('new-products-badge');
        
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }
    
    updateFooter() {
        // Update current year
        if (this.elements.currentYear) {
            this.elements.currentYear.textContent = new Date().getFullYear();
        }
        
        // Update currency display
        if (this.elements.currencyDisplay) {
            const currency = WD_CONFIG.website.defaultCurrency || 'INR';
            const symbol = WD_CONFIG.website.currencySymbol || '₹';
            this.elements.currencyDisplay.textContent = `${currency} (${symbol})`;
        }
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    setupEventListeners() {
        // Category filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-btn')) {
                const button = e.target.closest('.category-btn');
                const category = button.dataset.category;
                this.handleCategoryChange(category);
            }
        });
        
        // Sort select
        if (this.elements.sortSelect) {
            this.elements.sortSelect.addEventListener('change', (e) => {
                this.handleSortChange(e.target.value);
            });
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
        
        // View toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const button = e.target.closest('.view-btn');
                const view = button.dataset.view;
                this.handleViewChange(view);
            }
        });
        
        // Product actions
        document.addEventListener('click', (e) => {
            // Details button
            if (e.target.closest('.details-btn')) {
                const button = e.target.closest('.details-btn');
                const productId = button.dataset.id;
                this.handleViewDetails(productId);
            }
            
            // Add to cart button
            if (e.target.closest('.cart-btn')) {
                const button = e.target.closest('.cart-btn');
                const productId = button.dataset.id;
                this.handleAddToCart(productId);
            }
            
            // Quick view button
            if (e.target.closest('.quick-view-btn')) {
                const button = e.target.closest('.quick-view-btn');
                const productId = button.dataset.id;
                this.handleQuickView(productId);
            }
            
            // Compare checkbox
            if (e.target.closest('.compare-checkbox')) {
                const button = e.target.closest('.compare-checkbox');
                const productId = button.dataset.id;
                this.handleCompareToggle(productId);
            }
        });
        
        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pagination-btn')) {
                const button = e.target.closest('.pagination-btn');
                if (button.classList.contains('prev')) {
                    this.handlePageChange(this.state.currentPage - 1);
                } else if (button.classList.contains('next')) {
                    this.handlePageChange(this.state.currentPage + 1);
                }
            }
            
            if (e.target.closest('.pagination-number')) {
                const button = e.target.closest('.pagination-number');
                const page = parseInt(button.dataset.page);
                this.handlePageChange(page);
            }
        });
        
        // Reset filters
        if (this.elements.resetFiltersBtn) {
            this.elements.resetFiltersBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
        
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Cart toggle
        if (this.elements.cartButton) {
            this.elements.cartButton.addEventListener('click', () => {
                this.toggleCartSidebar();
            });
        }
        
        // Window events
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }
    
    handleCategoryChange(category) {
        this.state.currentCategory = category;
        this.state.currentPage = 1;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.applyFilters();
        this.renderProducts();
        this.renderPagination();
        
        // Track analytics
        this.trackEvent('category_filter', { category });
    }
    
    handleSortChange(sortType) {
        this.state.currentSort = sortType;
        this.state.currentPage = 1;
        
        this.applyFilters();
        this.renderProducts();
        
        // Track analytics
        this.trackEvent('sort_change', { sort_type: sortType });
    }
    
    handleSearch(query) {
        this.state.searchQuery = query;
        this.state.currentPage = 1;
        
        this.applyFilters();
        this.renderProducts();
        this.renderPagination();
        
        // Track analytics
        if (query.trim()) {
            this.trackEvent('search', { query });
        }
    }
    
    handleViewChange(view) {
        this.state.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update container class
        const container = this.elements.productsContainer;
        if (container) {
            container.className = `products-${view}`;
        }
        
        // Re-render products with new view
        this.renderProducts();
        
        // Track analytics
        this.trackEvent('view_change', { view });
    }
    
    handlePageChange(page) {
        if (page < 1 || page > Math.ceil(this.state.filteredProducts.length / this.state.itemsPerPage)) {
            return;
        }
        
        this.state.currentPage = page;
        this.renderProducts();
        this.renderPagination();
        this.scrollToProducts();
        
        // Track analytics
        this.trackEvent('page_change', { page });
    }
    
    handleViewDetails(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;
        
        // Show product details modal or page
        this.showProductDetailsModal(product);
        
        // Track analytics
        this.trackEvent('product_view', { 
            product_id: productId,
            product_name: product.name 
        });
    }
    
    handleAddToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;
        
        // Add to cart
        if (this.cartManager) {
            this.cartManager.addToCart(productId, 1);
            this.state.cart = this.cartManager.getCart();
        } else {
            // Simple cart implementation
            const existingItem = this.state.cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.state.cart.push({
                    id: productId,
                    product: product,
                    quantity: 1
                });
            }
        }
        
        // Update UI
        this.updateCartBadge();
        
        // Show notification
        this.showNotification(`${product.name} added to cart`, 'success');
        
        // Track analytics
        this.trackEvent('add_to_cart', { 
            product_id: productId,
            product_name: product.name,
            price: product.pricing?.finalPrice || 0
        });
    }
    
    handleQuickView(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;
        
        this.showQuickViewModal(product);
        
        // Track analytics
        this.trackEvent('quick_view', { product_id: productId });
    }
    
    handleCompareToggle(productId) {
        const index = this.state.selectedProducts.indexOf(productId);
        const button = document.querySelector(`.compare-checkbox[data-id="${productId}"]`);
        
        if (index === -1) {
            // Add to comparison
            if (this.state.selectedProducts.length >= 4) {
                this.showNotification('Maximum 4 products can be compared', 'warning');
                return;
            }
            
            this.state.selectedProducts.push(productId);
            if (button) {
                button.innerHTML = '<i class="fas fa-check-square"></i>';
                button.classList.add('selected');
            }
        } else {
            // Remove from comparison
            this.state.selectedProducts.splice(index, 1);
            if (button) {
                button.innerHTML = '<i class="far fa-square"></i>';
                button.classList.remove('selected');
            }
        }
        
        // Update compare button
        this.updateCompareButton();
        
        // Track analytics
        this.trackEvent('compare_toggle', { 
            product_id: productId,
            action: index === -1 ? 'add' : 'remove'
        });
    }
    
    handleResize() {
        // Adjust UI for mobile/desktop
        if (window.innerWidth < 768) {
            // Mobile optimizations
            if (this.state.currentView === 'compact') {
                this.handleViewChange('grid');
            }
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            if (this.elements.searchInput) {
                this.elements.searchInput.focus();
            }
        }
        
        // Esc to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }
    
    // ============================================
    // UI COMPONENT INITIALIZATION
    // ============================================
    initCategoryFilters() {
        const container = this.elements.categoryFilters;
        if (!container) return;
        
        // Get categories from config or products
        const categories = WD_CONFIG.categories || [
            { id: 'all', name: 'All Products', icon: 'fas fa-th' },
            { id: 'main', name: 'Main Modules', icon: 'fas fa-cube' },
            { id: 'extension', name: 'Extension Modules', icon: 'fas fa-puzzle-piece' },
            { id: 'new', name: 'Recent Launches', icon: 'fas fa-rocket' }
        ];
        
        container.innerHTML = categories.map(cat => `
            <button class="category-btn ${this.state.currentCategory === cat.id ? 'active' : ''}" 
                    data-category="${cat.id}">
                <i class="${cat.icon}"></i>
                ${cat.name}
                ${cat.id === 'new' && this.recentLaunchesManager ? 
                    `<span class="new-indicator"></span>` : ''
                }
            </button>
        `).join('');
    }
    
    initSortOptions() {
        const select = this.elements.sortSelect;
        if (!select) return;
        
        const sortOptions = WD_CONFIG.sortOptions || [
            { id: 'newest', name: 'Newest First' },
            { id: 'price-asc', name: 'Price: Low to High' },
            { id: 'price-desc', name: 'Price: High to Low' },
            { id: 'name-asc', name: 'Name: A to Z' }
        ];
        
        select.innerHTML = sortOptions.map(opt => `
            <option value="${opt.id}" ${this.state.currentSort === opt.id ? 'selected' : ''}>
                ${opt.name}
            </option>
        `).join('');
    }
    
    initViewToggle() {
        // Set initial active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.state.currentView);
        });
        
        // Set initial container class
        const container = this.elements.productsContainer;
        if (container) {
            container.className = `products-${this.state.currentView}`;
        }
    }
    
    // ============================================
    // MODAL & SIDEBAR FUNCTIONS
    // ============================================
    showProductDetailsModal(product) {
        // Implementation depends on your modal system
        alert(`Product Details:\n\nName: ${product.name}\nPrice: ₹${product.pricing?.finalPrice || 0}`);
    }
    
    showQuickViewModal(product) {
        const modal = this.elements.quickviewModal;
        if (!modal) return;
        
        // Generate modal content
        const content = `
            <div class="quickview-content">
                <div class="quickview-header">
                    <h3>${product.name}</h3>
                    <button class="quickview-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="quickview-body">
                    <div class="quickview-image">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="quickview-info">
                        <p class="quickview-description">${product.description || product.specialty}</p>
                        <div class="quickview-price">₹${product.pricing?.finalPrice || 0}</div>
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.innerHTML = content;
        modal.classList.add('show');
        
        // Add event listeners for this modal
        const closeBtn = modal.querySelector('.quickview-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.handleAddToCart(product.id);
                modal.classList.remove('show');
            });
        }
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
    
    toggleCartSidebar() {
        const sidebar = this.elements.cartSidebar;
        const overlay = document.getElementById('cart-overlay');
        
        if (!sidebar || !overlay) return;
        
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        
        // Update cart display
        this.updateCartDisplay();
    }
    
    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;
        
        if (this.state.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }
        
        cartItems.innerHTML = this.state.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.product.name}</div>
                    <div class="cart-item-price">₹${item.product.pricing?.finalPrice || 0}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Update total
        const total = this.state.cart.reduce((sum, item) => {
            return sum + (item.product.pricing?.finalPrice || 0) * item.quantity;
        }, 0);
        
        const totalElement = document.getElementById('cart-total-price');
        if (totalElement) {
            totalElement.textContent = `₹${total}`;
        }
        
        // Add event listeners for cart buttons
        this.setupCartEventListeners();
    }
    
    setupCartEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.quantity-btn').dataset.id;
                const isPlus = e.target.classList.contains('plus');
                this.updateCartQuantity(productId, isPlus ? 1 : -1);
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item-remove').dataset.id;
                this.removeFromCart(productId);
            });
        });
    }
    
    updateCartQuantity(productId, change) {
        const item = this.state.cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCartDisplay();
            this.updateCartBadge();
        }
    }
    
    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
        this.updateCartBadge();
        
        // Show notification
        this.showNotification('Item removed from cart', 'info');
    }
    
    closeAllModals() {
        // Close all open modals and sidebars
        const modals = ['cart-sidebar', 'comparison-modal', 'quickview-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove('show', 'open');
        });
        
        const overlay = document.getElementById('cart-overlay');
        if (overlay) overlay.classList.remove('show');
    }
    
    // ============================================
    // THEME MANAGEMENT
    // ============================================
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.state.theme = theme;
        
        // Update theme toggle icon
        const toggle = this.elements.themeToggle;
        if (toggle) {
            toggle.innerHTML = theme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
        
        // Save to localStorage
        localStorage.setItem('wdalpha_theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Track analytics
        this.trackEvent('theme_toggle', { theme: newTheme });
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    resetFilters() {
        this.state.currentCategory = 'all';
        this.state.currentSort = 'newest';
        this.state.searchQuery = '';
        this.state.currentPage = 1;
        this.state.activeFilters = {};
        
        // Reset UI elements
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        
        if (this.elements.sortSelect) {
            this.elements.sortSelect.value = 'newest';
        }
        
        // Update category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });
        
        // Re-render
        this.applyFilters();
        this.renderProducts();
        this.renderPagination();
        
        // Show notification
        this.showNotification('All filters have been reset', 'info');
        
        // Track analytics
        this.trackEvent('reset_filters');
    }
    
    updateCompareButton() {
        const compareBtn = document.getElementById('compare-btn');
        const compareCount = document.getElementById('compare-count');
        
        if (compareBtn && compareCount) {
            const count = this.state.selectedProducts.length;
            compareCount.textContent = count;
            compareBtn.disabled = count < 2;
            
            if (count >= 2) {
                compareBtn.addEventListener('click', () => {
                    this.showComparisonModal();
                });
            }
        }
    }
    
    showComparisonModal() {
        const modal = this.elements.comparisonModal;
        if (!modal) return;
        
        // Get products to compare
        const products = this.state.selectedProducts
            .map(id => this.state.products.find(p => p.id === id))
            .filter(p => p);
        
        if (products.length < 2) return;
        
        // Generate comparison table
        const comparisonBody = document.getElementById('comparison-body');
        if (comparisonBody) {
            comparisonBody.innerHTML = this.generateComparisonTable(products);
        }
        
        modal.classList.add('show');
        
        // Add close event
        const closeBtn = modal.querySelector('.comparison-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
    
    generateComparisonTable(products) {
        // Define comparison fields
        const fields = [
            { name: 'Price', getValue: p => `₹${p.pricing?.finalPrice || 0}` },
            { name: 'Category', getValue: p => p.category },
            { name: 'Launch Date', getValue: p => 
                p.launchInfo?.launchDate ? 
                new Date(p.launchInfo.launchDate).toLocaleDateString('en-IN') : 
                'N/A' 
            },
            { name: 'Features', getValue: p => 
                p.features ? p.features.slice(0, 3).join(', ') : 'N/A'
            }
        ];
        
        return `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Feature</th>
                        ${products.map(p => `<th>${p.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${fields.map(field => `
                        <tr>
                            <td class="feature-name">${field.name}</td>
                            ${products.map(p => `
                                <td class="feature-value">${field.getValue(p)}</td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    scrollToProducts() {
        const productsSection = document.getElementById('products-container');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    animateProductCards() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
            card.classList.add('animate-in');
        });
    }
    
    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    showNotification(message, type = 'info') {
        const toast = document.getElementById('notification-toast');
        const messageEl = document.getElementById('toast-message');
        
        if (!toast || !messageEl) return;
        
        // Set message and type
        messageEl.textContent = message;
        toast.className = `notification-toast ${type}`;
        
        // Show toast
        toast.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
        
        // Add close button event
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                toast.classList.remove('show');
            };
        }
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
    
    showError(message) {
        this.showNotification(message, 'error');
        
        // Also log to console
        console.error(message);
    }
    
    // ============================================
    // USER PREFERENCES
    // ============================================
    applyUserPreferences() {
        // Load from localStorage
        const savedItemsPerPage = localStorage.getItem('wdalpha_items_per_page');
        if (savedItemsPerPage) {
            this.state.itemsPerPage = parseInt(savedItemsPerPage);
            
            // Update select element if exists
            const select = document.getElementById('items-per-page');
            if (select) {
                select.value = savedItemsPerPage;
            }
        }
        
        // Apply other preferences...
    }
    
    saveUserPreferences() {
        localStorage.setItem('wdalpha_items_per_page', this.state.itemsPerPage.toString());
        // Save other preferences...
    }
    
    // ============================================
    // ANALYTICS & TRACKING
    // ============================================
    trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('config', WD_CONFIG.analytics?.googleAnalyticsId || '', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
    }
    
    trackEvent(action, params = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, params);
        }
        
        // Also log to console in development
        if (WD_CONFIG.maintenance?.debug) {
            console.log(`Event tracked: ${action}`, params);
        }
    }
    
    // ============================================
    // EXPORT & DATA HANDLING
    // ============================================
    exportProductList(format = 'json') {
        const data = {
            exported: new Date().toISOString(),
            total: this.state.filteredProducts.length,
            products: this.state.filteredProducts.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.pricing?.finalPrice || 0,
                launchDate: p.launchInfo?.launchDate
            }))
        };
        
        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data.products);
            default:
                return data;
        }
    }
    
    convertToCSV(products) {
        const headers = ['ID', 'Name', 'Category', 'Price', 'Launch Date'];
        const rows = products.map(p => [
            p.id,
            `"${p.name}"`,
            p.category,
            p.price,
            p.launchDate || 'N/A'
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    // ============================================
    // PUBLIC API METHODS
    // ============================================
    
    // Get product by ID
    getProduct(productId) {
        return this.state.products.find(p => p.id === productId);
    }
    
    // Get all products
    getAllProducts() {
        return this.state.products;
    }
    
    // Get filtered products
    getFilteredProducts() {
        return this.state.filteredProducts;
    }
    
    // Get cart items
    getCart() {
        return this.state.cart;
    }
    
    // Get application state
    getState() {
        return { ...this.state };
    }
    
    // Refresh data (for admin updates)
    async refreshData() {
        this.showLoading();
        await this.loadProducts();
        this.applyFilters();
        this.renderAll();
        this.hideLoading();
        this.showNotification('Product data refreshed', 'success');
    }
}

// ============================================
// APPLICATION BOOTSTRAP
// ============================================

// Create global app instance
let appInstance = null;

function initApp() {
    if (!appInstance) {
        appInstance = new WDAlphaApp();
        window.WDAlphaApp = appInstance; // Make available globally
    }
    return appInstance;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WDAlphaApp,
        initApp
    };
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // Show user-friendly error message
    if (appInstance) {
        appInstance.showError('An unexpected error occurred. Please try again.');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});
