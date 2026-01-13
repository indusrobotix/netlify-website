// IndusRoboTix Premium Website Scripts

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
    
    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
        
        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ===== MODULE DETAILS MODAL =====
    const detailsButtons = document.querySelectorAll('.details-btn');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const module = this.getAttribute('data-module');
            showModuleDetails(module);
        });
    });
    
    function showModuleDetails(moduleNumber) {
        const modules = {
            1: {
                title: "Module I: Alpha Base",
                description: "Your permanent mechanical foundation. Built with 3mm laser-cut acrylic, high-torque DC motors, and professional-grade hardware. This is the starting point for all your robotics projects.",
                features: [
                    "3mm Laser-cut Acrylic Chassis",
                    "2x High-torque DC Gear Motors",
                    "Professional Mounting Hardware Kit",
                    "3S 18650 Battery Holder",
                    "Caster Wheel for Stability",
                    "All Screws, Nuts, and Tools"
                ],
                price: "1,300 PKR",
                oldPrice: "1,450 PKR"
            },
            3: {
                title: "Module III: Line Following Robot",
                description: "Complete autonomous navigation system with 3 IR sensors. Perfect for robotics competitions and AI courses. Includes everything from Module I plus advanced electronics.",
                features: [
                    "Everything in Module I",
                    "Arduino UNO with USB Cable",
                    "L298N Motor Driver Module",
                    "3x TCRT5000 IR Sensors",
                    "Complete Wiring Harness",
                    "Pre-programmed with Demo Code"
                ],
                price: "3,750 PKR",
                oldPrice: "4,150 PKR"
            },
            5: {
                title: "Module V: Bluetooth Controlled Robot",
                description: "Wireless control via smartphone app. Perfect for IoT projects and wireless control systems. HC-05 Bluetooth module included with app control.",
                features: [
                    "Everything in Module I",
                    "HC-05 Bluetooth Module",
                    "Mobile Control App",
                    "Wireless Range: 10-15m",
                    "Multiple Control Modes",
                    "Real-time Sensor Data"
                ],
                price: "3,850 PKR",
                oldPrice: "4,250 PKR"
            }
        };
        
        const module = modules[moduleNumber];
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay" id="moduleModal">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h3>${module.title}</h3>
                    <p class="modal-description">${module.description}</p>
                    
                    <div class="modal-features">
                        <h4>Features:</h4>
                        <ul>
                            ${module.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-price">
                        <span class="modal-old-price">${module.oldPrice}</span>
                        <span class="modal-new-price">${module.price}</span>
                    </div>
                    
                    <div class="modal-actions">
                        <a href="https://wa.me/923121179306?text=I want ${encodeURIComponent(module.title)}" 
                           class="btn btn-whatsapp">
                            <i class="fab fa-whatsapp"></i> Order on WhatsApp
                        </a>
                        <button class="btn btn-outline modal-close-btn">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal styles if not already present
        if (!document.querySelector('#modalStyles')) {
            const modalStyles = `
                <style id="modalStyles">
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        padding: 20px;
                        animation: fadeIn 0.3s ease;
                    }
                    
                    .modal-content {
                        background: white;
                        border-radius: 20px;
                        padding: 2.5rem;
                        max-width: 500px;
                        width: 100%;
                        position: relative;
                        animation: slideUp 0.3s ease;
                        max-height: 80vh;
                        overflow-y: auto;
                    }
                    
                    .modal-close {
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        background: none;
                        border: none;
                        font-size: 2rem;
                        cursor: pointer;
                        color: var(--gray);
                        transition: var(--transition);
                    }
                    
                    .modal-close:hover {
                        color: var(--primary);
                        transform: rotate(90deg);
                    }
                    
                    .modal-content h3 {
                        color: var(--primary);
                        margin-bottom: 1rem;
                        font-size: 1.8rem;
                    }
                    
                    .modal-description {
                        color: var(--gray);
                        margin-bottom: 1.5rem;
                        line-height: 1.6;
                    }
                    
                    .modal-features {
                        background: var(--light);
                        padding: 1.5rem;
                        border-radius: 10px;
                        margin-bottom: 1.5rem;
                    }
                    
                    .modal-features h4 {
                        color: var(--primary);
                        margin-bottom: 1rem;
                    }
                    
                    .modal-features ul {
                        list-style: none;
                        padding: 0;
                    }
                    
                    .modal-features li {
                        padding: 0.5rem 0;
                        color: var(--gray);
                        position: relative;
                        padding-left: 1.5rem;
                    }
                    
                    .modal-features li::before {
                        content: '✓';
                        position: absolute;
                        left: 0;
                        color: var(--accent);
                        font-weight: bold;
                    }
                    
                    .modal-price {
                        text-align: center;
                        margin: 2rem 0;
                    }
                    
                    .modal-old-price {
                        display: block;
                        text-decoration: line-through;
                        color: var(--gray);
                        font-size: 1.2rem;
                    }
                    
                    .modal-new-price {
                        display: block;
                        color: var(--accent);
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin-top: 0.5rem;
                    }
                    
                    .modal-actions {
                        display: flex;
                        gap: 1rem;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', modalStyles);
        }
        
        // Close modal functionality
        const modal = document.getElementById('moduleModal');
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                modal.remove();
            });
        });
        
        // Close on overlay click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal) {
                modal.remove();
            }
        });
    }
    
    // ===== PRODUCT IMAGE GALLERY =====
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    
    zoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const imgSrc = this.getAttribute('href');
            openLightbox(imgSrc);
        });
    });
    
    function openLightbox(imgSrc) {
        const lightboxHTML = `
            <div class="lightbox-overlay">
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <img src="${imgSrc}" alt="Product Image">
                    <div class="lightbox-controls">
                        <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                        <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        const lightbox = document.querySelector('.lightbox-overlay');
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.closest('.lightbox-close')) {
                lightbox.remove();
            }
        });
    }
    
    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-item h3');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current) + '+';
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            // Start animation when in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }
    
    // Initialize counters
    animateCounters();
    
    // ===== FORM SUBMISSION =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Create WhatsApp message
            const message = `New Contact Form Submission:%0A%0A` +
                           `Name: ${data.name}%0A` +
                           `Email: ${data.email}%0A` +
                           `Phone: ${data.phone}%0A` +
                           `University: ${data.university}%0A` +
                           `Message: ${data.message}`;
            
            // Redirect to WhatsApp
            window.open(`https://wa.me/923121179306?text=${message}`, '_blank');
            
            // Show success message
            alert('Thank you! You will be redirected to WhatsApp to complete your inquiry.');
            
            // Reset form
            this.reset();
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const elementInView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) * 0.75
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('animated');
    };
    
    const handleScrollAnimation = () => {
        animatedElements.forEach((el) => {
            if (elementInView(el)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check
    handleScrollAnimation();
    
    // ===== PARALLAX EFFECT =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ===== TYPING EFFECT =====
    function initTypingEffect() {
        const typingElement = document.querySelector('.typing-effect');
        if (!typingElement) return;
        
        const texts = [
            "Robotics Kits",
            "STEM Education",
            "University Projects",
            "IoT Solutions"
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }
        
        type();
    }
    
    // Initialize typing effect
    initTypingEffect();
    
    // ===== CONSOLE GREETING =====
    console.log('%c🤖 IndusRoboTix 🤖', 'font-size: 24px; color: #00b0ff; font-weight: bold;');
    console.log('%cWelcome to our premium website!', 'color: #666; font-size: 16px;');
    console.log('%cNeed assistance? WhatsApp: +92 312 1179306', 'color: #25D366; font-size: 14px;');
    
    // ===== LAZY LOAD IMAGES =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// ===== SERVICE WORKER FOR OFFLINE SUPPORT =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}