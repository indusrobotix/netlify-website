// IndusRoboTix Configuration
const IndusRoboTixConfig = {
    // Company Information
    company: {
        name: "IndusRoboTix",
        founder: "Furqan Khatti",
        country: "Pakistan",
        flag: "🇵🇰",
        tagline: "Robotics Reimagined in Pakistan",
        description: "Pakistan's premier modular robotics kits manufacturer",
        contact: {
            email: "contact@indusrobotix.pk",
            phone: "Coming Soon",
            location: "Pakistan"
        }
    },
    
    // Website Configuration
    website: {
        // Currency Settings
        currency: "PKR",
        currencySymbol: "₨",
        locale: "en-PK",
        
        // Theme Settings
        defaultTheme: "dark",
        enableThemeToggle: true,
        
        // Product Display
        productsPerPage: 12,
        recentDaysThreshold: 30,
        enablePriceBreakdown: true,
        
        // Features
        enableCart: true,
        enableSearch: true,
        enableFilters: true,
        enableQuickView: true
    },
    
    // Product Categories
    categories: [
        {
            id: "all",
            name: "All Kits",
            icon: "fas fa-th",
            description: "Browse all 2WD Alpha kits"
        },
        {
            id: "main",
            name: "Main Modules",
            icon: "fas fa-cube",
            description: "Complete standalone robotics kits"
        },
        {
            id: "extension",
            name: "Extension Kits",
            icon: "fas fa-puzzle-piece",
            description: "Add-on kits to upgrade existing modules"
        },
        {
            id: "new",
            name: "New Arrivals",
            icon: "fas fa-rocket",
            description: "Recently launched kits"
        },
        {
            id: "starter",
            name: "Starter Kits",
            icon: "fas fa-play-circle",
            description: "Beginner-friendly kits"
        }
    ],
    
    // Sorting Options
    sortOptions: [
        {
            id: "newest",
            name: "Newest First",
            icon: "fas fa-calendar-plus"
        },
        {
            id: "price-low",
            name: "Price: Low to High",
            icon: "fas fa-sort-amount-down-alt"
        },
        {
            id: "price-high",
            name: "Price: High to Low",
            icon: "fas fa-sort-amount-down"
        },
        {
            id: "name",
            name: "Name: A to Z",
            icon: "fas fa-sort-alpha-down"
        }
    ],
    
    // View Modes
    viewModes: [
        {
            id: "grid",
            name: "Grid View",
            icon: "fas fa-th-large"
        },
        {
            id: "list",
            name: "List View",
            icon: "fas fa-list"
        }
    ],
    
    // Cart Configuration
    cart: {
        maxQuantity: 10,
        taxRate: 0.00, // No tax in Pakistan for educational kits
        shippingOptions: [
            {
                name: "Standard Shipping",
                price: 200,
                days: "5-7 business days"
            },
            {
                name: "Express Shipping",
                price: 500,
                days: "2-3 business days"
            }
        ]
    },
    
    // Default State
    defaults: {
        currentCategory: "all",
        currentSort: "newest",
        currentView: "grid",
        itemsPerPage: 12
    }
};

// Make config globally available
window.IndusRoboTixConfig = IndusRoboTixConfig;

// Helper functions
function getConfig(path, defaultValue = null) {
    const parts = path.split('.');
    let current = IndusRoboTixConfig;
    
    for (const part of parts) {
        if (current[part] === undefined) {
            return defaultValue;
        }
        current = current[part];
    }
    
    return current;
}

// Initialize configuration
function initConfig() {
    // Load saved theme
    const savedTheme = localStorage.getItem('indusrobotix_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', IndusRoboTixConfig.website.defaultTheme);
    }
    
    // Load other preferences
    const savedItemsPerPage = localStorage.getItem('indusrobotix_items_per_page');
    if (savedItemsPerPage) {
        IndusRoboTixConfig.defaults.itemsPerPage = parseInt(savedItemsPerPage);
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfig);
} else {
    initConfig();
}
