// Audience navigation functionality
class UniversityHomepage {
    constructor() {
        this.currentAudience = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showDefaultContent();
    }

    bindEvents() {
        // Audience card click handlers
        const audienceCards = document.querySelectorAll('.audience-card');
        audienceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const audience = card.getAttribute('data-audience');
                this.showAudienceContent(audience);
            });

            // Add hover effects
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('active')) {
                    card.style.transform = 'translateY(-3px)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('active')) {
                    card.style.transform = 'translateY(0)';
                }
            });
        });

        // Quick access links analytics (simulate tracking)
        const quickLinks = document.querySelectorAll('.quick-link');
        quickLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // In a real implementation, this would send analytics data
                console.log('Quick access used:', link.textContent.trim());
            });
        });

        // Responsive menu handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    showAudienceContent(audience) {
        // Remove active class from all cards
        const allCards = document.querySelectorAll('.audience-card');
        allCards.forEach(card => card.classList.remove('active'));

        // Add active class to selected card
        const selectedCard = document.querySelector(`[data-audience="${audience}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }

        // Hide all content sections
        const allSections = document.querySelectorAll('.content-section');
        allSections.forEach(section => section.classList.remove('active'));

        // Show selected content section
        const targetSection = document.getElementById(`${audience}-content`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentAudience = audience;

        // Smooth scroll to content
        const contentSections = document.querySelector('.content-sections');
        if (contentSections) {
            contentSections.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Track user interaction (analytics simulation)
        this.trackAudienceSelection(audience);
    }

    showDefaultContent() {
        // Show prospective student content by default
        this.showAudienceContent('prospective');
    }

    trackAudienceSelection(audience) {
        // Simulate analytics tracking
        const timestamp = new Date().toISOString();
        console.log(`Audience selected: ${audience} at ${timestamp}`);
        
        // In a real implementation, this would send data to analytics service
        // Example: gtag('event', 'audience_selection', { audience: audience });
    }

    handleResize() {
        // Adjust layout for mobile if needed
        const isMobile = window.innerWidth < 768;
        const audienceGrid = document.querySelector('.audience-grid');
        
        if (isMobile) {
            audienceGrid.style.maxWidth = '400px';
        } else {
            audienceGrid.style.maxWidth = '1000px';
        }
    }
}

// Utility functions for enhanced user experience
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addFocusManagement();
        this.addAriaLabels();
    }

    addKeyboardNavigation() {
        const audienceCards = document.querySelectorAll('.audience-card');
        
        audienceCards.forEach((card, index) => {
            // Make cards keyboard accessible
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextCard = audienceCards[index + 1] || audienceCards[0];
                    nextCard.focus();
                }
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevCard = audienceCards[index - 1] || audienceCards[audienceCards.length - 1];
                    prevCard.focus();
                }
            });
        });
    }

    addFocusManagement() {
        // Ensure focus is visible
        const focusableElements = document.querySelectorAll('a, button, [tabindex]');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid #007bff';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }

    addAriaLabels() {
        // Add descriptive aria labels for screen readers
        const audienceCards = document.querySelectorAll('.audience-card');
        
        audienceCards.forEach(card => {
            const title = card.querySelector('h4').textContent;
            const description = card.querySelector('p').textContent;
            card.setAttribute('aria-label', `${title}: ${description}`);
        });
    }
}

// Animation helper for smooth interactions
class AnimationHelper {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static slideIn(element, direction = 'up', duration = 300) {
        const transform = direction === 'up' ? 'translateY(20px)' : 'translateX(20px)';
        
        element.style.transform = transform;
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            
            element.style.transform = `translateY(${20 * (1 - easedProgress)}px)`;
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.transform = '';
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UniversityHomepage();
    new AccessibilityEnhancer();
    
    // Add loading state management
    document.body.classList.add('loaded');
    
    console.log('Riverside University Homepage initialized successfully');
});