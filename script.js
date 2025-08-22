// Parallax Scrolling Effects and Animations
document.addEventListener('DOMContentLoaded', function() {
    
    // Parallax elements
    const moon = document.querySelector('.moon');
    const stars = document.querySelector('.stars');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroMountains = document.querySelector('.hero-mountains');
    const navbar = document.querySelector('.navbar');
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements and observe them
    const fadeElements = document.querySelectorAll('.section-title, .problem-intro, .stats-container, .chat-container, .objective-quote');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Parallax scroll effect
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        
        // Only apply parallax effects when in hero section
        if (scrolled < heroHeight) {
            // Moon parallax - moves slower
            if (moon) {
                moon.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Stars parallax - moves very slowly
            if (stars) {
                stars.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            
            // Hero text parallax - moves faster
            if (heroTitle) {
                heroTitle.style.transform = `translateY(${scrolled * 0.4}px)`;
                heroTitle.style.opacity = 1 - (scrolled / heroHeight) * 1.5;
            }
            
            if (heroSubtitle) {
                heroSubtitle.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroSubtitle.style.opacity = 1 - (scrolled / heroHeight) * 1.5;
            }
            
            // Mountains parallax - moves slower than text
            if (heroMountains) {
                heroMountains.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
            
            // CTA button parallax
            const ctaButton = document.querySelector('.cta-button');
            if (ctaButton) {
                ctaButton.style.transform = `translateY(${scrolled * 0.6}px)`;
                ctaButton.style.opacity = 1 - (scrolled / heroHeight) * 2;
            }
        }
        
        // Navbar background opacity based on scroll
        if (navbar) {
            const opacity = Math.min(scrolled / 100, 0.95);
            navbar.style.backgroundColor = `rgba(40, 53, 100, ${opacity})`;
            navbar.style.backdropFilter = scrolled > 50 ? 'blur(10px)' : 'none';
        }
    }
    
    // Enhanced navigation handling
    function setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Check if it's an external page link
                if (href.endsWith('.html') || href === 'index.html') {
                    // Allow normal navigation for external pages
                    return;
                }
                
                // Check if it's an internal anchor link
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    } else {
                        // If section doesn't exist on current page, redirect to home page with hash
                        window.location.href = 'index.html' + href;
                    }
                } else {
                    // For any other links, allow normal navigation
                    return;
                }
            });
        });
    }
    
    // Chat animation effects
    function animateChat() {
        const messages = document.querySelectorAll('.message');
        
        messages.forEach((message, index) => {
            // Add entrance animation delay
            message.style.animationDelay = `${index * 0.3}s`;
            
            // Add typing effect
            message.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            message.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // Stats box hover effects
    function setupStatsInteraction() {
        const statBoxes = document.querySelectorAll('.stat-box');
        
        statBoxes.forEach(box => {
            box.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.05)';
                this.style.transition = 'all 0.3s ease';
                this.style.boxShadow = '0 10px 30px rgba(255, 245, 191, 0.3)';
            });
            
            box.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            });
        });
    }
    
    // Button hover effects
    function setupButtonEffects() {
        const buttons = document.querySelectorAll('.cta-button, .section-button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Floating animation for moon
    function animateMoon() {
        if (moon) {
            let moonOffset = 0;
            
            function floatMoon() {
                moonOffset += 0.02;
                const floatY = Math.sin(moonOffset) * 10;
                const currentTransform = moon.style.transform || '';
                
                // Preserve parallax transform and add floating
                if (currentTransform.includes('translateY')) {
                    const parallaxMatch = currentTransform.match(/translateY\(([^)]+)\)/);
                    const parallaxValue = parallaxMatch ? parallaxMatch[1] : '0px';
                    const parallaxNumber = parseFloat(parallaxValue);
                    moon.style.transform = `translateY(${parallaxNumber + floatY}px)`;
                } else {
                    moon.style.transform = `translateY(${floatY}px)`;
                }
                
                requestAnimationFrame(floatMoon);
            }
            
            floatMoon();
        }
    }
    
    // Twinkling stars effect
    function animateStars() {
        if (stars) {
            let twinkleOffset = 0;
            
            function twinkleStars() {
                twinkleOffset += 0.05;
                const opacity = 0.3 + Math.sin(twinkleOffset) * 0.3;
                stars.style.opacity = opacity;
                
                requestAnimationFrame(twinkleStars);
            }
            
            twinkleStars();
        }
    }
    
    // Scroll progress indicator
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #FFF5BF, #f0e6a0);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        function updateProgress() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
        
        window.addEventListener('scroll', updateProgress);
    }
    
    // Performance optimized scroll handler
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleParallax);
            ticking = true;
        }
    }
    
    function handleScroll() {
        ticking = false;
        requestTick();
    }
    
    // CTA Button smooth scroll functionality
    function setupCTAButton() {
        const ctaButton = document.querySelector('.cta-button');
        const problemSection = document.querySelector('.problem-section');
        
        if (ctaButton && problemSection) {
            ctaButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                const offsetTop = problemSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add a subtle click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }
    }

    // Handle hash navigation on page load
    function handleHashNavigation() {
        const hash = window.location.hash;
        if (hash) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    }

    // Logo navigation
    function setupLogoNavigation() {
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }
    }

    // Initialize all functions
    setupSmoothScrolling();
    setupLogoNavigation();
    setupCTAButton();
    animateChat();
    setupStatsInteraction();
    setupButtonEffects();
    animateMoon();
    animateStars();
    createScrollProgress();
    handleHashNavigation();
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    
    // Resize handler for responsive parallax
    window.addEventListener('resize', function() {
        // Recalculate parallax on resize
        handleParallax();
    });
    
    // Intersection observer for chat messages animation
    const chatObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInMessage 0.6s ease forwards';
                entry.target.style.animationDelay = '0.1s';
            }
        });
    }, { threshold: 0.3 });
    
    const chatMessages = document.querySelectorAll('.message');
    chatMessages.forEach(message => {
        chatObserver.observe(message);
    });
    
    // Add CSS animations via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInMessage {
            0% {
                opacity: 0;
                transform: translateX(-30px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .message.right {
            animation-name: slideInMessageRight;
        }
        
        @keyframes slideInMessageRight {
            0% {
                opacity: 0;
                transform: translateX(30px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Voice button interaction
    const voiceButton = document.querySelector('.voice-button');
    if (voiceButton) {
        voiceButton.addEventListener('click', function() {
            this.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    }
    
    // Add pulse animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(pulseStyle);
    
    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                inquiry: formData.get('inquiry')
            };
            
            // Simple form validation
            if (!data.firstName || !data.lastName || !data.email || !data.inquiry) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you soon.');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    // Download button functionality (now a link to Google Drive)
    const downloadButton = document.querySelector('.download-button');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Visual feedback for link click
            const originalText = this.textContent;
            this.textContent = 'Opening...';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 1000);
        });
    }
    
    // Intersection observer for information page animations
    const infoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special animation for strategy cards
                if (entry.target.classList.contains('strategy-card')) {
                    const cards = document.querySelectorAll('.strategy-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = 'slideInUp 0.6s ease forwards';
                        }, index * 200);
                    });
                }
            }
        });
    }, { threshold: 0.2 });
    
    // Observe information page elements
    const infoElements = document.querySelectorAll('.helpful-item, .strategy-card, .habit-tracker-display');
    infoElements.forEach(el => {
        el.classList.add('fade-in');
        infoObserver.observe(el);
    });
    
    // Add slideInUp animation
    const slideInStyle = document.createElement('style');
    slideInStyle.textContent = `
        @keyframes slideInUp {
            0% {
                opacity: 0;
                transform: translateY(50px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(slideInStyle);
});

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
