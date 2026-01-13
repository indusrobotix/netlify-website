/**
 * WD Alpha Robotics - Configuration Settings
 * Central configuration file for all website settings
 * Last Updated: 2024-12-14
 */

const WD_CONFIG = {
    
    // ============================================
    // COMPANY INFORMATION
    // ============================================
    company: {
        name: "WD Alpha Robotics",
        tagline: "Modular. Upgradeable. Advanced.",
        slogan: "Build the Future, One Module at a Time",
        description: "WD Alpha Robotics provides modular, upgradeable robotics kits for education, research, and hobbyists.",
        
        contact: {
            email: "sales@wdalpha-robotics.com",
            phone: "+91 98765 43210",
            address: "Tech Park, Innovation District, Bangalore, India",
            supportHours: "Mon-Fri: 9AM-6PM IST"
        },
        
        social: {
            twitter: "https://twitter.com/wdalpha",
            linkedin: "https://linkedin.com/company/wdalpha",
            github: "https://github.com/wdalpha",
            youtube: "https://youtube.com/c/wdalpha",
            instagram: "https://instagram.com/wdalpha.robotics"
        }
    },

    // ============================================
    // WEBSITE SETTINGS
    // ============================================
    website: {
        // Site defaults
        defaultTheme: "dark", // "dark" or "light"
        enableThemeToggle: true,
        enableAnimations: true,
        enableRippleEffects: true,
        
        // Performance
        lazyLoadImages: true,
        debounceSearch: 300, // milliseconds
        throttleScroll: 100, // milliseconds
        
        // Features
        enableCart: true,
        enableComparison: true,
        enableQuickView: true,
        enableWishlist: false, // Coming soon
        enableRatings: false, // Coming soon
        
        // Display
        productsPerPage: 12,
        recentLaunchDays: 30, // Products launched within X days are "new"
        featuredProductCount: 5,
        
        // Currency & Localization
        defaultCurrency: "INR",
        currencySymbol: "₹",
        locale: "en-IN",
        timezone: "Asia/Kolkata",
        
        // Analytics (Configure your own IDs)
        googleAnalyticsId: "", // UA-XXXXXXXXX-X
        googleTagManagerId: "", // GTM-XXXXXXX
        facebookPixelId: ""
    },

    // ============================================
    // PRODUCT CATEGORIES CONFIGURATION
    // ============================================
    categories: [
        {
            id: "all",
            name: "All Products",
            icon: "fas fa-th",
            description: "Browse all available robotics kits",
            color: "#3b82f6",
            order: 1
        },
        {
            id: "main",
            name: "Main Modules",
            icon: "fas fa-cube",
            description: "Complete standalone robotics kits",
            color: "#10b981",
            order: 2
        },
        {
            id: "extension",
            name: "Extension Modules",
            icon: "fas fa-puzzle-piece",
            description: "Add-on kits to upgrade existing modules",
            color: "#8b5cf6",
            order: 3
        },
        {
            id: "new",
            name: "Recent Launches",
            icon: "fas fa-rocket",
            description: "Newly launched products",
            color: "#f59e0b",
            order: 4,
            showNewIndicator: true
        },
        {
            id: "premium",
            name: "Premium Kits",
            icon: "fas fa-crown",
            description: "Advanced kits with premium features",
            color: "#ec4899",
            order: 5,
            filter: (product) => product.finalPrice > 4000
        },
        {
            id: "starter",
            name: "Starter Kits",
            icon: "fas fa-play-circle",
            description: "Beginner-friendly kits",
            color: "#06b6d4",
            order: 6,
            filter: (product) => product.tags && product.tags.includes("starter")
        },
        {
            id: "ai",
            name: "AI & Vision",
            icon: "fas fa-brain",
            description: "Kits with AI and computer vision",
            color: "#8b5cf6",
            order: 7,
            filter: (product) => product.tags && product.tags.includes("ai")
        },
        {
            id: "wireless",
            name: "Wireless Control",
            icon: "fas fa-wifi",
            description: "Bluetooth and remote controlled",
            color: "#3b82f6",
            order: 8,
            filter: (product) => product.tags && (product.tags.includes("bluetooth") || product.tags.includes("remote"))
        }
    ],

    // ============================================
    // SORTING OPTIONS
    // ============================================
    sortOptions: [
        {
            id: "newest",
            name: "Newest First",
            icon: "fas fa-calendar-plus",
            description: "Sort by launch date (newest to oldest)",
            sortFunction: (a, b) => new Date(b.launchDate) - new Date(a.launchDate),
            order: 1
        },
        {
            id: "popular",
            name: "Most Popular",
            icon: "fas fa-fire",
            description: "Sort by popularity (coming soon)",
            sortFunction: (a, b) => (b.popularity || 0) - (a.popularity || 0),
            order: 2
        },
        {
            id: "price-asc",
            name: "Price: Low to High",
            icon: "fas fa-sort-amount-down-alt",
            description: "Sort by price (lowest first)",
            sortFunction: (a, b) => a.finalPrice - b.finalPrice,
            order: 3
        },
        {
            id: "price-desc",
            name: "Price: High to Low",
            icon: "fas fa-sort-amount-down",
            description: "Sort by price (highest first)",
            sortFunction: (a, b) => b.finalPrice - a.finalPrice,
            order: 4
        },
        {
            id: "name-asc",
            name: "Name: A to Z",
            icon: "fas fa-sort-alpha-down",
            description: "Sort alphabetically (A to Z)",
            sortFunction: (a, b) => a.name.localeCompare(b.name),
            order: 5
        },
        {
            id: "name-desc",
            name: "Name: Z to A",
            icon: "fas fa-sort-alpha-down-alt",
            description: "Sort alphabetically (Z to A)",
            sortFunction: (a, b) => b.name.localeCompare(a.name),
            order: 6
        },
        {
            id: "featured",
            name: "Featured",
            icon: "fas fa-star",
            description: "Featured products first",
            sortFunction: (a, b) => (b.featured || false) - (a.featured || false),
            order: 7
        }
    ],

    // ============================================
    // VIEW MODES CONFIGURATION
    // ============================================
    viewModes: [
        {
            id: "grid",
            name: "Grid View",
            icon: "fas fa-th-large",
            description: "Display products in grid layout",
            itemsPerRow: 3,
            order: 1
        },
        {
            id: "list",
            name: "List View",
            icon: "fas fa-list",
            description: "Display products in list layout",
            itemsPerRow: 1,
            order: 2
        },
        {
            id: "compact",
            name: "Compact View",
            icon: "fas fa-th",
            description: "Display products in compact grid",
            itemsPerRow: 4,
            order: 3
        }
    ],

    // ============================================
    // FEATURED PRODUCTS CONFIGURATION
    // ============================================
    featuredProducts: {
        enabled: true,
        autoSelect: true, // Automatically select featured based on criteria
        selectionCriteria: [
            { tag: "premium", weight: 3 },
            { tag: "new", weight: 2 },
            { tag: "ai", weight: 1.5 },
            { tag: "popular", weight: 1.2 }
        ],
        maxCount: 5
    },

    // ============================================
    // PRICE FILTER CONFIGURATION
    // ============================================
    priceFilter: {
        enabled: true,
        minPrice: 0,
        maxPrice: 10000,
        steps: 100,
        ranges: [
            { label: "Under ₹2000", min: 0, max: 2000 },
            { label: "₹2000 - ₹4000", min: 2000, max: 4000 },
            { label: "₹4000 - ₹6000", min: 4000, max: 6000 },
            { label: "Over ₹6000", min: 6000, max: 10000 }
        ]
    },

    // ============================================
    // CART CONFIGURATION
    // ============================================
    cart: {
        enabled: true,
        maxQuantity: 10,
        allowGiftWrapping: true,
        shippingOptions: [
            { name: "Standard Shipping", price: 100, days: "5-7" },
            { name: "Express Shipping", price: 250, days: "2-3" },
            { name: "Overnight", price: 500, days: "1" }
        ],
        taxRate: 0.18, // 18% GST
        discountCodes: [
            { code: "WELCOME10", discount: 0.10, type: "percentage", minPurchase: 0 },
            { code: "STUDENT15", discount: 0.15, type: "percentage", minPurchase: 3000 },
            { code: "FREESHIP", discount: 100, type: "fixed", minPurchase: 5000 }
        ]
    },

    // ============================================
    // PRODUCT DETAILS DISPLAY
    // ============================================
    productDisplay: {
        showPriceBreakdown: true,
        showStockStatus: true,
        showSKU: true,
        showDimensions: true,
        showWeight: true,
        showWarranty: true,
        warrantyPeriod: "1 year",
        
        // Feature display
        maxFeaturesVisible: 3,
        showAllFeaturesInDetail: true,
        
        // Image display
        defaultImage: "fas fa-robot",
        imagePlaceholderColor: "#3b82f6",
        
        // Meta information
        showLaunchDate: true,
        showCategory: true,
        showTags: true
    },

    // ============================================
    // NOTIFICATION SETTINGS
    // ============================================
    notifications: {
        // Toast notifications
        toastDuration: 5000, // milliseconds
        toastPosition: "top-right", // top-right, top-left, bottom-right, bottom-left
        
        // Announcement banner
        announcementEnabled: true,
        announcementDuration: 7, // days to show announcement
        
        // Stock notifications
        lowStockThreshold: 5,
        showStockNotifications: true,
        
        // Price drop notifications
        enablePriceAlert: false // Coming soon
    },

    // ============================================
    // SEO & METADATA CONFIGURATION
    // ============================================
    seo: {
        defaultTitle: "WD Alpha Robotics | Modular Robot Kits",
        defaultDescription: "Advanced modular robotics kits for education, research, and hobbyists. Build, program, and upgrade with WD Alpha.",
        defaultKeywords: "robotics, robot kits, STEM, education, AI robots, modular robots, WD Alpha",
        
        // Open Graph
        ogImage: "/og-image.jpg",
        ogType: "website",
        
        // Twitter Cards
        twitterCard: "summary_large_image",
        twitterSite: "@wdalpha",
        
        // Structured Data
        enableSchema: true,
        organizationSchema: {
            type: "Organization",
            name: "WD Alpha Robotics",
            url: "https://wdalpha-robotics.com",
            logo: "https://wdalpha-robotics.com/logo.png",
            description: "Manufacturer of modular robotics kits",
            foundingDate: "2020",
            founders: ["John Doe", "Jane Smith"]
        }
    },

    // ============================================
    // ANALYTICS & TRACKING
    // ============================================
    analytics: {
        // Page view tracking
        trackPageViews: true,
        trackProductViews: true,
        trackAddToCart: true,
        trackPurchases: true,
        
        // User behavior
        trackScrollDepth: true,
        trackTimeOnPage: true,
        trackClicks: true,
        
        // Event categories
        eventCategories: {
            product: "Product Interaction",
            cart: "Shopping Cart",
            filter: "Product Filter",
            search: "Search",
            navigation: "Navigation"
        }
    },

    // ============================================
    // PERFORMANCE SETTINGS
    // ============================================
    performance: {
        // Lazy loading
        lazyLoadOffset: 100, // pixels before viewport
        lazyLoadImages: true,
        lazyLoadBackgrounds: true,
        
        // Caching
        cacheProducts: true,
        cacheDuration: 3600000, // 1 hour in milliseconds
        localStorageKey: "wdalpha_cache",
        
        // Compression
        enableImageOptimization: true,
        imageQuality: 80, // percentage
        imageFormats: ["webp", "jpg", "png"],
        
        // Bundle optimization
        enableCodeSplitting: true,
        criticalCSS: true
    },

    // ============================================
    // API & EXTERNAL SERVICES
    // ============================================
    api: {
        // Base URLs
        baseUrl: "https://api.wdalpha-robotics.com",
        productEndpoint: "/api/v1/products",
        categoriesEndpoint: "/api/v1/categories",
        ordersEndpoint: "/api/v1/orders",
        
        // Authentication
        authEnabled: false,
        apiKey: "",
        
        // Rate limiting
        rateLimit: 100, // requests per minute
        retryAttempts: 3,
        
        // Fallback (if API fails)
        useLocalData: true,
        localDataFile: "products-data.json"
    },

    // ============================================
    // MAINTENANCE & DEBUGGING
    // ============================================
    maintenance: {
        // Debug mode
        debug: false,
        logLevel: "info", // debug, info, warn, error
        consoleColors: true,
        
        // Maintenance mode
        maintenanceMode: false,
        maintenanceMessage: "We're performing scheduled maintenance. We'll be back soon!",
        
        // Error handling
        showErrorsToUsers: false,
        errorReporting: true,
        errorReportingService: "console", // console, sentry, google-analytics
        sentryDSN: "" // Add your Sentry DSN here
    },

    // ============================================
    // LOCALIZATION & INTERNATIONALIZATION
    // ============================================
    i18n: {
        defaultLanguage: "en",
        supportedLanguages: ["en", "hi", "ta", "te", "kn", "ml"],
        currencyFormats: {
            INR: {
                symbol: "₹",
                format: "₹{amount}",
                decimal: ".",
                thousand: ","
            },
            USD: {
                symbol: "$",
                format: "${amount}",
                decimal: ".",
                thousand: ","
            },
            EUR: {
                symbol: "€",
                format: "€{amount}",
                decimal: ",",
                thousand: "."
            }
        },
        dateFormats: {
            short: "DD/MM/YYYY",
            medium: "DD MMM YYYY",
            long: "DD MMMM YYYY"
        }
    },

    // ============================================
    // THEME & UI CONFIGURATION
    // ============================================
    theme: {
        // Color schemes
        colors: {
            primary: "#3b82f6",
            primaryDark: "#2563eb",
            primaryLight: "#60a5fa",
            secondary: "#10b981",
            accent: "#8b5cf6",
            danger: "#ef4444",
            warning: "#f59e0b",
            success: "#10b981",
            info: "#06b6d4"
        },
        
        // Dark theme
        dark: {
            background: "#0f172a",
            surface: "#1e293b",
            card: "#1e293b",
            text: {
                primary: "#f8fafc",
                secondary: "#94a3b8",
                muted: "#64748b"
            },
            border: "#334155"
        },
        
        // Light theme
        light: {
            background: "#ffffff",
            surface: "#f8fafc",
            card: "#ffffff",
            text: {
                primary: "#1e293b",
                secondary: "#475569",
                muted: "#64748b"
            },
            border: "#e2e8f0"
        },
        
        // Typography
        typography: {
            fontFamily: {
                sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                mono: "'Roboto Mono', 'Courier New', monospace"
            },
            fontSize: {
                xs: "0.75rem",
                sm: "0.875rem",
                base: "1rem",
                lg: "1.125rem",
                xl: "1.25rem",
                "2xl": "1.5rem",
                "3xl": "1.875rem",
                "4xl": "2.25rem",
                "5xl": "3rem"
            }
        },
        
        // Spacing
        spacing: {
            xs: "0.25rem",
            sm: "0.5rem",
            md: "1rem",
            lg: "1.5rem",
            xl: "2rem",
            "2xl": "3rem",
            "3xl": "4rem"
        },
        
        // Border radius
        borderRadius: {
            sm: "0.25rem",
            md: "0.5rem",
            lg: "0.75rem",
            xl: "1rem",
            "2xl": "1.5rem",
            full: "9999px"
        },
        
        // Shadows
        shadows: {
            sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            primary: "0 0 20px rgba(59, 130, 246, 0.3)"
        },
        
        // Transitions
        transitions: {
            fast: "150ms ease",
            normal: "300ms ease",
            slow: "500ms ease"
        }
    },

    // ============================================
    // EXPORT CONFIGURATION
    // ============================================
    export: {
        formats: ["csv", "json", "pdf"],
        csvDelimiter: ",",
        includeColumns: ["name", "specialty", "category", "finalPrice", "launchDate", "features"],
        pdfOptions: {
            orientation: "portrait",
            format: "a4",
            margin: { top: 20, right: 20, bottom: 20, left: 20 }
        }
    },

    // ============================================
    // VALIDATION RULES
    // ============================================
    validation: {
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneRegex: /^[\+]?[1-9][\d]{0,15}$/,
        passwordMinLength: 8,
        productNameMaxLength: 100,
        productDescriptionMaxLength: 1000
    },

    // ============================================
    // DEFAULT STATE
    // ============================================
    defaults: {
        // Initial state
        initialCategory: "all",
        initialSort: "newest",
        initialView: "grid",
        
        // Pagination
        currentPage: 1,
        
        // Filters
        activeFilters: [],
        searchQuery: "",
        priceRange: { min: 0, max: 10000 },
        
        // User preferences
        theme: "dark",
        itemsPerPage: 12,
        currency: "INR",
        language: "en"
    },

    // ============================================
    // VERSION & BUILD INFO
    // ============================================
    version: {
        major: 1,
        minor: 0,
        patch: 0,
        build: "20241214",
        releaseDate: "2024-12-14"
    }
};

/**
 * Helper function to get configuration value with fallback
 * @param {string} path - Dot notation path to config value
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Configuration value or default
 */
function getConfig(path, defaultValue = null) {
    const parts = path.split('.');
    let current = WD_CONFIG;
    
    for (const part of parts) {
        if (current[part] === undefined) {
            console.warn(`Config path "${path}" not found, using default value.`);
            return defaultValue;
        }
        current = current[part];
    }
    
    return current;
}

/**
 * Update configuration value
 * @param {string} path - Dot notation path to config value
 * @param {*} value - New value
 */
function setConfig(path, value) {
    const parts = path.split('.');
    let current = WD_CONFIG;
    
    // Navigate to the parent object
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (current[part] === undefined) {
            current[part] = {};
        }
        current = current[part];
    }
    
    // Set the value
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
    
    // Save to localStorage for persistence
    if (typeof Storage !== 'undefined') {
        localStorage.setItem('wdalpha_config', JSON.stringify(WD_CONFIG));
    }
}

/**
 * Initialize configuration from localStorage
 */
function initConfig() {
    if (typeof Storage !== 'undefined') {
        const savedConfig = localStorage.getItem('wdalpha_config');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                Object.assign(WD_CONFIG, parsed);
                console.log('Configuration loaded from localStorage');
            } catch (error) {
                console.error('Error loading configuration from localStorage:', error);
            }
        }
    }
    
    // Apply theme
    const savedTheme = localStorage.getItem('wdalpha_theme') || WD_CONFIG.website.defaultTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Apply other user preferences
    const savedItemsPerPage = localStorage.getItem('wdalpha_items_per_page');
    if (savedItemsPerPage) {
        WD_CONFIG.defaults.itemsPerPage = parseInt(savedItemsPerPage);
    }
}

/**
 * Reset configuration to defaults
 */
function resetConfig() {
    // Clear localStorage
    if (typeof Storage !== 'undefined') {
        localStorage.removeItem('wdalpha_config');
        localStorage.removeItem('wdalpha_theme');
        localStorage.removeItem('wdalpha_items_per_page');
    }
    
    // Reload page to apply defaults
    location.reload();
}

// Initialize configuration on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfig);
} else {
    initConfig();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WD_CONFIG, getConfig, setConfig, resetConfig };
}
