// IndusRoboTix Product Database
const IndusRoboTixProducts = {
    // Meta Information
    meta: {
        company: "IndusRoboTix",
        founder: "Furqan Khatti",
        country: "Pakistan",
        currency: "PKR",
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    
    // All Products
    products: [
        // Main Modules (Complete Kits)
        {
            id: "IR-001",
            sku: "2WD-ALPHA-MOD-1",
            name: "2WD Alpha Module (I) - Foundation Kit",
            shortName: "Foundation Kit",
            category: "main",
            type: "main",
            description: "The ultimate upgradeable base structure for beginners. Start your robotics journey with this comprehensive chassis kit.",
            detailedDescription: "Perfect for students and beginners in Pakistan. Includes aluminum chassis, DC motors, wheels, and all necessary hardware. Made in Pakistan with quality components.",
            specialty: "Robot Chassis Kit",
            
            technicalSpecs: {
                dimensions: "25cm x 20cm x 15cm",
                weight: "2.5kg",
                material: "Aluminum alloy chassis",
                power: "9V battery (not included)",
                motors: "2x 200 RPM DC motors",
                microcontroller: "Arduino compatible",
                madeIn: "Pakistan"
            },
            
            features: [
                "Upgradeable modular design",
                "Sturdy aluminum chassis",
                "High-torque DC motors",
                "Beginner-friendly assembly",
                "Made in Pakistan"
            ],
            
            pricing: {
                componentCost: 1100,
                margin: 138,
                discountAmount: 1287,
                finalPrice: 1300,
                currency: "PKR",
                discountPercentage: 10,
                marginPercentage: 10
            },
            
            inventory: {
                stock: 50,
                lowStockThreshold: 5,
                inStock: true,
                madeInPakistan: true
            },
            
            launchInfo: {
                launchDate: "2023-01-15",
                isNew: false,
                isFeatured: true,
                popularity: 95
            },
            
            tags: ["starter", "beginner", "chassis", "educational", "pakistan-made"]
        },
        
        {
            id: "IR-002",
            sku: "2WD-ALPHA-MOD-2",
            name: "2WD Alpha Module (II) - Smart Navigator",
            category: "main",
            type: "main",
            description: "Obstacle avoiding & human following robot. Perfect for learning sensor integration.",
            specialty: "Obstacle Avoiding & Human Following Robot",
            
            features: [
                "Ultrasonic obstacle avoidance",
                "IR human detection",
                "Autonomous navigation",
                "Educational algorithms"
            ],
            
            pricing: {
                componentCost: 2950,
                margin: 385,
                discountAmount: 3452,
                finalPrice: 3450,
                currency: "PKR"
            },
            
            launchInfo: {
                launchDate: "2023-03-20",
                isNew: false,
                popularity: 88
            },
            
            tags: ["autonomous", "sensors", "ai", "navigation"]
        },
        
        {
            id: "IR-003",
            sku: "2WD-ALPHA-MOD-3",
            name: "2WD Alpha Module (III) - Line Tracer",
            category: "main",
            type: "main",
            description: "Professional line following robot with precision control.",
            specialty: "Line Following Robot",
            
            pricing: {
                componentCost: 3210,
                margin: 417,
                discountAmount: 3756,
                finalPrice: 3750,
                currency: "PKR"
            },
            
            launchInfo: {
                launchDate: "2023-04-10",
                isNew: false,
                popularity: 76
            },
            
            tags: ["line-following", "precision", "control"]
        },
        
        {
            id: "IR-004",
            sku: "2WD-ALPHA-MOD-4",
            name: "2WD Alpha Module (IV) - Remote Commander",
            category: "main",
            type: "main",
            description: "IR remote controlled robot with 10-meter range.",
            specialty: "Remote Controlled Robot",
            
            pricing: {
                componentCost: 2930,
                margin: 380,
                discountAmount: 3428,
                finalPrice: 3450,
                currency: "PKR"
            },
            
            tags: ["remote", "control", "wireless"]
        },
        
        {
            id: "IR-005",
            sku: "2WD-ALPHA-MOD-5",
            name: "2WD Alpha Module (V) - Bluetooth Commander",
            category: "main",
            type: "main",
            description: "Smartphone-controlled robot via Bluetooth.",
            specialty: "Bluetooth Controlled Robot",
            
            pricing: {
                componentCost: 3280,
                margin: 426,
                discountAmount: 3838,
                finalPrice: 3850,
                currency: "PKR"
            },
            
            tags: ["bluetooth", "mobile", "smartphone"]
        },
        
        {
            id: "IR-006",
            sku: "2WD-ALPHA-MOD-6",
            name: "2WD Alpha Module (VI) - Tire Beast",
            category: "main",
            type: "main",
            description: "Triple-capability robot with line following, obstacle avoidance, and human following.",
            specialty: "LFR + Obstacle Avoidance + Human Following",
            
            pricing: {
                componentCost: 3490,
                margin: 453,
                discountAmount: 4083,
                finalPrice: 4100,
                currency: "PKR"
            },
            
            tags: ["combo", "advanced", "all-in-one"]
        },
        
        {
            id: "IR-007",
            sku: "2WD-ALPHA-MOD-7",
            name: "2WD Alpha Module (VII) - Quad Bot",
            category: "main",
            type: "main",
            description: "Advanced kit with four operational modes.",
            specialty: "Multi-mode Advanced Robot",
            
            pricing: {
                componentCost: 4140,
                margin: 538,
                discountAmount: 4844,
                finalPrice: 4850,
                currency: "PKR"
            },
            
            tags: ["quad-mode", "premium", "advanced"]
        },
        
        {
            id: "IR-008",
            sku: "2WD-ALPHA-MOD-8",
            name: "2WD Alpha Module (VIII) - Fall MAX",
            category: "main",
            type: "main",
            description: "Flagship kit with autonomous decision making.",
            specialty: "Autonomous System Robot",
            
            pricing: {
                componentCost: 4490,
                margin: 583,
                discountAmount: 5253,
                finalPrice: 5250,
                currency: "PKR"
            },
            
            tags: ["flagship", "autonomous", "premium"]
        },
        
        // NEW PRODUCTS (Last 30 days)
        {
            id: "IR-009",
            sku: "2WD-ALPHA-MOD-9",
            name: "2WD Alpha Module (IX) - AI Vision Bot",
            category: "main",
            type: "main",
            description: "AI-powered computer vision robot with real-time object detection. First of its kind in Pakistan!",
            specialty: "AI-Powered Computer Vision Robot",
            
            features: [
                "Real-time object detection",
                "Facial recognition",
                "Color tracking",
                "Made in Pakistan",
                "AI capabilities"
            ],
            
            pricing: {
                componentCost: 12500,
                margin: 1625,
                discountAmount: 14125,
                finalPrice: 14200,
                currency: "PKR"
            },
            
            inventory: {
                stock: 25,
                inStock: true,
                madeInPakistan: true
            },
            
            launchInfo: {
                launchDate: new Date().toISOString().split('T')[0], // Today's date
                isNew: true,
                isFeatured: true,
                popularity: 92,
                launchPromotion: {
                    active: true,
                    description: "Launch Special: Free AI tutorial",
                    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }
            },
            
            tags: ["ai", "vision", "new", "premium", "pakistan-made", "featured"]
        },
        
        {
            id: "IR-010",
            sku: "2WD-ALPHA-MOD-10",
            name: "2WD Alpha Module (X) - Drone Edition",
            category: "main",
            type: "main",
            description: "Your first flying robot! Quadcopter with GPS and camera.",
            specialty: "Aerial Robotics Kit",
            
            pricing: {
                componentCost: 8500,
                margin: 1105,
                discountAmount: 9605,
                finalPrice: 9700,
                currency: "PKR"
            },
            
            launchInfo: {
                launchDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
                isNew: true,
                isFeatured: true
            },
            
            tags: ["drone", "aerial", "new", "flying"]
        },
        
        // Extension Kits
        {
            id: "IR-101",
            sku: "2WD-EXT-MOD-2",
            name: "2WD Alpha Extension (II)",
            category: "extension",
            type: "extension",
            description: "Add obstacle avoidance to your existing robot.",
            specialty: "Obstacle Avoidance Add-on",
            
            pricing: {
                componentCost: 1930,
                margin: 231,
                discountAmount: 2084,
                finalPrice: 2080,
                currency: "PKR"
            },
            
            tags: ["addon", "upgrade", "sensors"]
        },
        
        {
            id: "IR-102",
            sku: "2WD-EXT-MOD-3",
            name: "2WD Alpha Extension (III)",
            category: "extension",
            type: "extension",
            description: "Add line following capabilities.",
            specialty: "Line Following Add-on",
            
            pricing: {
                componentCost: 2180,
                margin: 261,
                discountAmount: 2354,
                finalPrice: 2350,
                currency: "PKR"
            },
            
            tags: ["addon", "line-following"]
        },
        
        {
            id: "IR-103",
            sku: "2WD-EXT-MOD-9",
            name: "2WD Alpha Extension (IX) - AI Vision Upgrade",
            category: "extension",
            type: "extension",
            description: "Upgrade your robot with AI vision capabilities.",
            specialty: "AI Vision Upgrade Kit",
            
            pricing: {
                componentCost: 4200,
                margin: 546,
                discountAmount: 4746,
                finalPrice: 4800,
                currency: "PKR"
            },
            
            launchInfo: {
                launchDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
                isNew: true,
                isFeatured: true
            },
            
            tags: ["ai", "vision", "new", "upgrade"]
        },
        
        // Starter Kits
        {
            id: "IR-201",
            sku: "STARTER-KIT-1",
            name: "Indus Beginner Kit",
            category: "starter",
            type: "main",
            description: "Complete beginner package with Foundation Kit + accessories.",
            specialty: "Complete Starter Package",
            
            pricing: {
                componentCost: 1800,
                margin: 234,
                discountAmount: 2034,
                finalPrice: 2050,
                currency: "PKR"
            },
            
            tags: ["starter", "beginner", "educational"]
        }
    ],
    
    // Helper Methods
    getAllProducts: function() {
        return this.products;
    },
    
    getProductById: function(id) {
        return this.products.find(product => product.id === id);
    },
    
    getProductsByCategory: function(category) {
        return this.products.filter(product => product.category === category);
    },
    
    getNewProducts: function(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return this.products.filter(product => {
            if (!product.launchInfo || !product.launchInfo.launchDate) return false;
            const launchDate = new Date(product.launchInfo.launchDate);
            return launchDate >= cutoffDate;
        });
    },
    
    getFeaturedProducts: function() {
        return this.products.filter(product => product.launchInfo?.isFeatured);
    },
    
    // Statistics
    getStats: function() {
        const products = this.products;
        return {
            total: products.length,
            mainModules: products.filter(p => p.category === 'main').length,
            extensionKits: products.filter(p => p.category === 'extension').length,
            newProducts: this.getNewProducts().length,
            averagePrice: Math.round(products.reduce((sum, p) => sum + p.pricing.finalPrice, 0) / products.length),
            madeInPakistan: products.filter(p => p.inventory?.madeInPakistan).length
        };
    }
};

// Make products globally available
window.IndusRoboTixProducts = IndusRoboTixProducts;
