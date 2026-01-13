/**
 * WD Alpha Robotics - Recent Launches Manager
 * Automatically detects and highlights new products
 * Last Updated: 2024-12-14
 */

class RecentLaunches {
    constructor(productsData, config) {
        this.products = productsData.products || [];
        this.config = config || {};
        this.currentDate = new Date();
        this.recentProducts = [];
        this.newProductsCount = 0;
        
        // Default configuration
        this.defaultConfig = {
            recentDaysThreshold: 30,
            highlightNewBadge: true,
            showAnnouncementBanner: true,
            maxRecentDisplay: 5,
            enableAutoDetection: true,
            promotionDays: 7, // Special promotion period
            badgeText: "NEW",
            badgeColor: "#f59e0b",
            enableCountdown: false,
            countdownDays: 14 // Countdown for "Just Launched"
        };
        
        // Merge with provided config
        this.config = { ...this.defaultConfig, ...config };
        
        this.init();
    }
    
    init() {
        if (this.config.enableAutoDetection) {
            this.detectRecentLaunches();
            this.markNewProducts();
            this.calculateStats();
            this.updateBadges();
        }
    }
    
    /**
     * Detect products launched within the recent days threshold
     */
    detectRecentLaunches() {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - this.config.recentDaysThreshold);
        
        this.recentProducts = this.products.filter(product => {
            if (!product.launchInfo || !product.launchInfo.launchDate) {
                return false;
            }
            
            const launchDate = new Date(product.launchInfo.launchDate);
            return launchDate >= thresholdDate;
        });
        
        // Sort by launch date (newest first)
        this.recentProducts.sort((a, b) => {
            return new Date(b.launchInfo.launchDate) - new Date(a.launchInfo.launchDate);
        });
        
        this.newProductsCount = this.recentProducts.length;
        
        console.log(`Detected ${this.newProductsCount} new products in last ${this.config.recentDaysThreshold} days`);
    }
    
    /**
     * Mark products as new in the original data
     */
    markNewProducts() {
        this.products.forEach(product => {
            if (product.launchInfo && product.launchInfo.launchDate) {
                const launchDate = new Date(product.launchInfo.launchDate);
                const thresholdDate = new Date();
                thresholdDate.setDate(thresholdDate.getDate() - this.config.recentDaysThreshold);
                
                product.launchInfo.isNew = launchDate >= thresholdDate;
                
                // Calculate days since launch
                const timeDiff = this.currentDate - launchDate;
                product.launchInfo.daysSinceLaunch = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                
                // Check if within promotion period
                if (this.config.promotionDays > 0) {
                    const promotionThreshold = new Date();
                    promotionThreshold.setDate(promotionThreshold.getDate() - this.config.promotionDays);
                    product.launchInfo.hasPromotion = launchDate >= promotionThreshold;
                }
            }
        });
    }
    
    /**
     * Calculate statistics about recent launches
     */
    calculateStats() {
        const stats = {
            totalNew: this.newProductsCount,
            byCategory: {},
            averagePrice: 0,
            priceRange: { min: Infinity, max: 0 },
            launchTimeline: []
        };
        
        if (this.recentProducts.length === 0) return stats;
        
        let totalPrice = 0;
        
        this.recentProducts.forEach(product => {
            // Category distribution
            const category = product.category || 'uncategorized';
            stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
            
            // Price calculations
            const price = product.pricing?.finalPrice || 0;
            totalPrice += price;
            stats.priceRange.min = Math.min(stats.priceRange.min, price);
            stats.priceRange.max = Math.max(stats.priceRange.max, price);
            
            // Launch timeline
            stats.launchTimeline.push({
                id: product.id,
                name: product.name,
                date: product.launchInfo.launchDate,
                daysAgo: product.launchInfo.daysSinceLaunch
            });
        });
        
        stats.averagePrice = Math.round(totalPrice / this.recentProducts.length);
        stats.launchTimeline.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.stats = stats;
        return stats;
    }
    
    /**
     * Generate announcement banner content
     */
    generateAnnouncement() {
        if (this.newProductsCount === 0 || !this.config.showAnnouncementBanner) {
            return null;
        }
        
        const announcements = [];
        
        // Main announcement
        if (this.newProductsCount === 1) {
            const product = this.recentProducts[0];
            announcements.push({
                type: 'single',
                title: `🎉 New Product Launch!`,
                message: `${product.name} is now available`,
                product: product,
                priority: 'high'
            });
        } else {
            announcements.push({
                type: 'multiple',
                title: `🎉 ${this.newProductsCount} New Products!`,
                message: `Explore our latest robotics kits launched in the last ${this.config.recentDaysThreshold} days`,
                priority: 'high'
            });
        }
        
        // Check for promotions
        const promotionalProducts = this.recentProducts.filter(p => 
            p.launchInfo?.hasPromotion && p.launchInfo?.launchPromotion?.active
        );
        
        if (promotionalProducts.length > 0) {
            promotionalProducts.forEach(product => {
                announcements.push({
                    type: 'promotion',
                    title: `🔥 Limited Time Offer!`,
                    message: `${product.name}: ${product.launchInfo.launchPromotion.description}`,
                    product: product,
                    validUntil: product.launchInfo.launchPromotion.validUntil,
                    priority: 'urgent'
                });
            });
        }
        
        // Sort by priority
        announcements.sort((a, b) => {
            const priorityOrder = { 'urgent': 0, 'high': 1, 'normal': 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        return announcements;
    }
    
    /**
     * Get products by launch recency
     */
    getProductsByRecency(days = 7) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - days);
        
        return this.products.filter(product => {
            if (!product.launchInfo?.launchDate) return false;
            const launchDate = new Date(product.launchInfo.launchDate);
            return launchDate >= thresholdDate;
        }).sort((a, b) => {
            return new Date(b.launchInfo.launchDate) - new Date(a.launchInfo.launchDate);
        });
    }
    
    /**
     * Get "Just Launched" products (last 14 days)
     */
    getJustLaunchedProducts() {
        return this.getProductsByRecency(14);
    }
    
    /**
     * Get products with active promotions
     */
    getPromotionalProducts() {
        return this.recentProducts.filter(product => 
            product.launchInfo?.hasPromotion && 
            product.launchInfo?.launchPromotion?.active
        );
    }
    
    /**
     * Update badges and indicators in the DOM
     */
    updateBadges() {
        if (!this.config.highlightNewBadge) return;
        
        // This would be called from main.js after DOM is loaded
        // Implementation depends on your specific DOM structure
    }
    
    /**
     * Generate HTML for recent products display
     */
    generateRecentProductsHTML(limit = null) {
        const productsToShow = limit ? 
            this.recentProducts.slice(0, limit) : 
            this.recentProducts;
        
        if (productsToShow.length === 0) {
            return `
                <div class="no-new-products">
                    <i class="fas fa-calendar-check"></i>
                    <p>No new products launched recently. Check back soon!</p>
                </div>
            `;
        }
        
        return productsToShow.map(product => this.generateProductCardHTML(product)).join('');
    }
    
    /**
     * Generate HTML for a single recent product card
     */
    generateProductCardHTML(product) {
        const launchDate = new Date(product.launchInfo.launchDate);
        const daysAgo = product.launchInfo.daysSinceLaunch;
        const isJustLaunched = daysAgo <= 14;
        const hasPromotion = product.launchInfo?.hasPromotion;
        
        let badgeText = this.config.badgeText;
        let badgeClass = 'new-badge';
        
        if (isJustLaunched) {
            badgeText = 'JUST LAUNCHED';
            badgeClass = 'just-launched-badge';
        }
        
        if (hasPromotion) {
            badgeText = '🔥 PROMOTION';
            badgeClass = 'promotion-badge';
        }
        
        return `
            <div class="recent-product-card" data-id="${product.id}">
                <div class="${badgeClass}">
                    <i class="fas fa-bolt"></i> ${badgeText}
                    ${isJustLaunched ? `<span class="days-count">${daysAgo}d ago</span>` : ''}
                </div>
                
                <div class="recent-product-image">
                    <i class="fas fa-robot"></i>
                    ${hasPromotion ? '<div class="promotion-ribbon">SPECIAL OFFER</div>' : ''}
                </div>
                
                <div class="recent-product-info">
                    <h4 class="recent-product-name">${product.name}</h4>
                    <p class="recent-product-specialty">${product.specialty}</p>
                    
                    <div class="recent-product-meta">
                        <span class="launch-date">
                            <i class="fas fa-calendar"></i>
                            Launched: ${launchDate.toLocaleDateString('en-IN')}
                        </span>
                        <span class="product-category">${product.category}</span>
                    </div>
                    
                    <div class="recent-product-features">
                        ${product.features ? product.features.slice(0, 3).map(feature => 
                            `<span class="feature-tag">${feature}</span>`
                        ).join('') : ''}
                    </div>
                    
                    <div class="recent-product-pricing">
                        <div class="price">₹${product.pricing?.finalPrice || 0}</div>
                        ${hasPromotion && product.launchInfo?.launchPromotion ? 
                            `<div class="promotion-text">${product.launchInfo.launchPromotion.description}</div>` : ''
                        }
                    </div>
                    
                    <div class="recent-product-actions">
                        <button class="view-details-btn" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="quick-add-btn" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate countdown for promotional products
     */
    generatePromotionCountdown(product) {
        if (!product.launchInfo?.launchPromotion?.validUntil) {
            return '';
        }
        
        const validUntil = new Date(product.launchInfo.launchPromotion.validUntil);
        const now = new Date();
        const timeDiff = validUntil - now;
        
        if (timeDiff <= 0) {
            return '<span class="countdown expired">Offer Expired</span>';
        }
        
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return `
            <div class="promotion-countdown">
                <i class="fas fa-clock"></i>
                <span class="countdown-text">Ends in: ${days}d ${hours}h</span>
            </div>
        `;
    }
    
    /**
     * Generate launch timeline visualization
     */
    generateLaunchTimeline() {
        if (!this.stats?.launchTimeline || this.stats.launchTimeline.length === 0) {
            return '<p>No recent launches to display.</p>';
        }
        
        const timelineItems = this.stats.launchTimeline.map(item => `
            <div class="timeline-item" data-days-ago="${item.daysAgo}">
                <div class="timeline-date">
                    ${new Date(item.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short' 
                    })}
                </div>
                <div class="timeline-content">
                    <div class="timeline-product">${item.name}</div>
                    <div class="timeline-days">${item.daysAgo} days ago</div>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="launch-timeline">
                <h4><i class="fas fa-timeline"></i> Recent Launch Timeline</h4>
                <div class="timeline-container">
                    ${timelineItems}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate statistics summary
     */
    generateStatsSummary() {
        const stats = this.stats || this.calculateStats();
        
        return `
            <div class="recent-stats-summary">
                <div class="stat-card">
                    <div class="stat-number">${stats.totalNew}</div>
                    <div class="stat-label">New Products</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${Object.keys(stats.byCategory).length}</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">₹${stats.averagePrice}</div>
                    <div class="stat-label">Avg Price</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">₹${stats.priceRange.min}-₹${stats.priceRange.max}</div>
                    <div class="stat-label">Price Range</div>
                </div>
            </div>
        `;
    }
    
    /**
     * Get products by category from recent launches
     */
    getRecentProductsByCategory(category) {
        return this.recentProducts.filter(product => product.category === category);
    }
    
    /**
     * Check if a product is new (by ID)
     */
    isProductNew(productId) {
        const product = this.recentProducts.find(p => p.id === productId);
        return !!product;
    }
    
    /**
     * Get days since launch for a product
     */
    getDaysSinceLaunch(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product?.launchInfo?.daysSinceLaunch) return null;
        return product.launchInfo.daysSinceLaunch;
    }
    
    /**
     * Update notification badge in header
     */
    updateNotificationBadge() {
        const badgeElement = document.getElementById('new-products-badge');
        if (badgeElement && this.newProductsCount > 0) {
            badgeElement.textContent = this.newProductsCount;
            badgeElement.style.display = 'inline-block';
            badgeElement.classList.add('has-new');
        }
    }
    
    /**
     * Setup event listeners for recent products
     */
    setupEventListeners() {
        // This would be called from main.js
        // Example:
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-details-btn')) {
                const productId = e.target.closest('.view-details-btn').dataset.productId;
                this.handleViewDetails(productId);
            }
            
            if (e.target.closest('.quick-add-btn')) {
                const productId = e.target.closest('.quick-add-btn').dataset.productId;
                this.handleQuickAdd(productId);
            }
        });
    }
    
    /**
     * Handle view details for recent product
     */
    handleViewDetails(productId) {
        const product = this.recentProducts.find(p => p.id === productId);
        if (product) {
            // Dispatch custom event or call your product view function
            const event = new CustomEvent('productView', { 
                detail: { product, source: 'recent-launches' }
            });
            document.dispatchEvent(event);
            
            // Track analytics
            this.trackProductView(product);
        }
    }
    
    /**
     * Handle quick add to cart
     */
    handleQuickAdd(productId) {
        const product = this.recentProducts.find(p => p.id === productId);
        if (product) {
            // Dispatch custom event or call your cart function
            const event = new CustomEvent('addToCart', { 
                detail: { product, source: 'recent-launches' }
            });
            document.dispatchEvent(event);
            
            // Show notification
            this.showAddToCartNotification(product);
            
            // Track analytics
            this.trackAddToCart(product);
        }
    }
    
    /**
     * Show notification when product is added to cart
     */
    showAddToCartNotification(product) {
        // Implementation depends on your notification system
        console.log(`Added ${product.name} to cart from recent launches`);
    }
    
    /**
     * Track product view for analytics
     */
    trackProductView(product) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                'event_category': 'Recent Launches',
                'event_label': product.name,
                'value': product.pricing?.finalPrice || 0
            });
        }
    }
    
    /**
     * Track add to cart for analytics
     */
    trackAddToCart(product) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                'event_category': 'Recent Launches',
                'event_label': product.name,
                'value': product.pricing?.finalPrice || 0
            });
        }
    }
    
    /**
     * Export recent products data
     */
    exportRecentProducts(format = 'json') {
        const data = {
            timestamp: new Date().toISOString(),
            total: this.newProductsCount,
            thresholdDays: this.config.recentDaysThreshold,
            products: this.recentProducts
        };
        
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data);
            case 'array':
                return this.recentProducts;
            default:
                return data;
        }
    }
    
    /**
     * Convert data to CSV format
     */
    convertToCSV(data) {
        const headers = ['ID', 'Name', 'Category', 'Price', 'Launch Date', 'Days Since Launch'];
        const rows = data.products.map(p => [
            p.id,
            `"${p.name}"`,
            p.category,
            p.pricing?.finalPrice || 0,
            p.launchInfo?.launchDate,
            p.launchInfo?.daysSinceLaunch || 0
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    /**
     * Get configuration for display
     */
    getDisplayConfig() {
        return {
            recentDaysThreshold: this.config.recentDaysThreshold,
            maxDisplay: this.config.maxRecentDisplay,
            showBadges: this.config.highlightNewBadge,
            showAnnouncement: this.config.showAnnouncementBanner,
            badgeColor: this.config.badgeColor,
            enableCountdown: this.config.enableCountdown
        };
    }
    
    /**
     * Update configuration dynamically
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.init(); // Re-initialize with new config
        
        // Dispatch config updated event
        const event = new CustomEvent('recentLaunchesConfigUpdated', { 
            detail: { config: this.config }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Reset to default configuration
     */
    resetConfig() {
        this.config = { ...this.defaultConfig };
        this.init();
    }
    
    /**
     * Get all new products with full details
     */
    getAllNewProducts() {
        return this.recentProducts;
    }
    
    /**
     * Get new product IDs only
     */
    getNewProductIds() {
        return this.recentProducts.map(p => p.id);
    }
    
    /**
     * Check if any new products exist
     */
    hasNewProducts() {
        return this.newProductsCount > 0;
    }
    
    /**
     * Get count of new products
     */
    getNewProductsCount() {
        return this.newProductsCount;
    }
}

/**
 * Recent Launches Manager Singleton
 * Use this for easy access throughout the application
 */
class RecentLaunchesManager {
    constructor() {
        this.instance = null;
        this.productsData = null;
        this.config = null;
    }
    
    static getInstance() {
        if (!this.instance) {
            this.instance = new RecentLaunchesManager();
        }
        return this.instance;
    }
    
    initialize(productsData, config = {}) {
        this.productsData = productsData;
        this.config = config;
        this.recentLaunches = new RecentLaunches(productsData, config);
        return this.recentLaunches;
    }
    
    getRecentLaunches() {
        if (!this.recentLaunches) {
            console.warn('RecentLaunches not initialized. Call initialize() first.');
            return null;
        }
        return this.recentLaunches;
    }
    
    // Convenience methods
    static getNewProducts() {
        const instance = this.getInstance();
        const rl = instance.getRecentLaunches();
        return rl ? rl.getAllNewProducts() : [];
    }
    
    static getAnnouncement() {
        const instance = this.getInstance();
        const rl = instance.getRecentLaunches();
        return rl ? rl.generateAnnouncement() : null;
    }
    
    static getStats() {
        const instance = this.getInstance();
        const rl = instance.getRecentLaunches();
        return rl ? rl.calculateStats() : {};
    }
    
    static isProductNew(productId) {
        const instance = this.getInstance();
        const rl = instance.getRecentLaunches();
        return rl ? rl.isProductNew(productId) : false;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RecentLaunches,
        RecentLaunchesManager
    };
}

// Auto-initialize if running in browser with global products data
if (typeof window !== 'undefined' && window.PRODUCTS_DATA) {
    document.addEventListener('DOMContentLoaded', () => {
        const manager = RecentLaunchesManager.getInstance();
        manager.initialize(window.PRODUCTS_DATA);
        
        // Make available globally
        window.RecentLaunchesManager = manager;
        
        console.log('Recent Launches Manager initialized');
    });
}
