// City of Riverside Homepage JavaScript
// Handles accessibility, language switching, search, and emergency alerts

class RiversideHomepage {
    constructor() {
        this.currentLanguage = 'en';
        this.isLargeText = false;
        this.isHighContrast = false;
        this.searchSuggestions = [
            'Pay water bill', 'Building permit', 'Report pothole', 'Business license',
            'Trash pickup schedule', 'City council meetings', 'Park reservations',
            'Property tax', 'Code enforcement', 'Street repair', 'Parking permit',
            'Recreation programs', 'Job opportunities', 'Municipal court',
            'Emergency alerts', 'Zoning information', 'Housing assistance'
        ];
        
        this.init();
    }
    
    init() {
        this.setupLanguageToggle();
        this.setupAccessibilityToggles();
        this.setupSearch();
        this.setupEmergencyAlerts();
        this.setupServiceTracking();
        this.setupKeyboardNavigation();
        
        // Initialize language on page load
        this.updateLanguage();
        
        // Check for emergency alerts on page load
        this.checkEmergencyAlerts();
    }
    
    // Language switching functionality
    setupLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle');
        
        langToggle.addEventListener('click', () => {
            this.currentLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
            this.updateLanguage();
            
            // Announce language change for screen readers
            this.announceToScreenReader(
                this.currentLanguage === 'en' 
                    ? 'Language switched to English' 
                    : 'Idioma cambiado a Español'
            );
        });
        
        // Keyboard support
        langToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                langToggle.click();
            }
        });
    }
    
    updateLanguage() {
        const elements = document.querySelectorAll('[data-en][data-es]');
        const placeholderElements = document.querySelectorAll('[data-placeholder-en][data-placeholder-es]');
        
        // Update text content
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        // Update placeholder text
        placeholderElements.forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${this.currentLanguage}`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
        
        // Update language toggle display
        const currentLangSpan = document.getElementById('current-lang');
        const altLangSpan = document.getElementById('alt-lang');
        
        if (this.currentLanguage === 'en') {
            currentLangSpan.textContent = 'EN';
            altLangSpan.textContent = 'ES';
        } else {
            currentLangSpan.textContent = 'ES';
            altLangSpan.textContent = 'EN';
        }
        
        // Update document language
        document.documentElement.lang = this.currentLanguage;
        
        // Update page title
        const titleElement = document.querySelector('title[data-default]');
        if (titleElement) {
            titleElement.textContent = this.currentLanguage === 'en' 
                ? 'City of Riverside - Your City Services'
                : 'Ciudad de Riverside - Sus Servicios Municipales';
        }
    }
    
    // Accessibility toggles
    setupAccessibilityToggles() {
        const textSizeToggle = document.getElementById('text-size-toggle');
        const contrastToggle = document.getElementById('high-contrast-toggle');
        
        // Text size toggle
        textSizeToggle.addEventListener('click', () => {
            this.isLargeText = !this.isLargeText;
            document.body.classList.toggle('large-text', this.isLargeText);
            textSizeToggle.classList.toggle('active', this.isLargeText);
            
            this.announceToScreenReader(
                this.isLargeText 
                    ? 'Large text enabled' 
                    : 'Large text disabled'
            );
            
            // Save preference
            localStorage.setItem('riverside-large-text', this.isLargeText);
        });
        
        // High contrast toggle
        contrastToggle.addEventListener('click', () => {
            this.isHighContrast = !this.isHighContrast;
            document.body.classList.toggle('high-contrast', this.isHighContrast);
            contrastToggle.classList.toggle('active', this.isHighContrast);
            
            this.announceToScreenReader(
                this.isHighContrast 
                    ? 'High contrast enabled' 
                    : 'High contrast disabled'
            );
            
            // Save preference
            localStorage.setItem('riverside-high-contrast', this.isHighContrast);
        });
        
        // Load saved preferences
        this.loadAccessibilityPreferences();
    }
    
    loadAccessibilityPreferences() {
        const savedLargeText = localStorage.getItem('riverside-large-text') === 'true';
        const savedHighContrast = localStorage.getItem('riverside-high-contrast') === 'true';
        
        if (savedLargeText) {
            this.isLargeText = true;
            document.body.classList.add('large-text');
            document.getElementById('text-size-toggle').classList.add('active');
        }
        
        if (savedHighContrast) {
            this.isHighContrast = true;
            document.body.classList.add('high-contrast');
            document.getElementById('high-contrast-toggle').classList.add('active');
        }
    }
    
    // Search functionality
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-btn');
        const suggestionsContainer = document.getElementById('search-suggestions');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                this.showSearchSuggestions(query, suggestionsContainer);
            } else {
                this.hideSearchSuggestions(suggestionsContainer);
            }
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(searchInput.value);
            }
            
            // Handle arrow key navigation in suggestions
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSuggestions(e.key, suggestionsContainer);
            }
        });
        
        searchButton.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                this.hideSearchSuggestions(suggestionsContainer);
            }
        });
    }
    
    showSearchSuggestions(query, container) {
        const matches = this.searchSuggestions
            .filter(suggestion => suggestion.toLowerCase().includes(query))
            .slice(0, 5);
        
        if (matches.length > 0) {
            container.innerHTML = matches
                .map(match => `<div class="suggestion-item" tabindex="0">${match}</div>`)
                .join('');
            container.classList.remove('hidden');
            
            // Add click handlers to suggestions
            container.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('search-input').value = item.textContent;
                    this.hideSearchSuggestions(container);
                    this.performSearch(item.textContent);
                });
                
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        item.click();
                    }
                });
            });
        } else {
            this.hideSearchSuggestions(container);
        }
    }
    
    hideSearchSuggestions(container) {
        container.classList.add('hidden');
        container.innerHTML = '';
    }
    
    navigateSuggestions(direction, container) {
        const suggestions = container.querySelectorAll('.suggestion-item');
        const focused = document.activeElement;
        const currentIndex = Array.from(suggestions).indexOf(focused);
        
        let newIndex;
        if (direction === 'ArrowDown') {
            newIndex = currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
        } else {
            newIndex = currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
        }
        
        if (suggestions[newIndex]) {
            suggestions[newIndex].focus();
        }
    }
    
    performSearch(query) {
        if (!query.trim()) return;
        
        // In a real implementation, this would integrate with the city's search system
        this.announceToScreenReader(`Searching for: ${query}`);
        
        // Simulate search results page navigation
        console.log(`Searching for: ${query}`);
        alert(`This would search for: "${query}"\nIn a real site, this would navigate to search results.`);
    }
    
    // Emergency alert system
    setupEmergencyAlerts() {
        const emergencyBanner = document.getElementById('emergency-banner');
        const emergencyClose = document.getElementById('emergency-close');
        
        emergencyClose.addEventListener('click', () => {
            emergencyBanner.classList.add('hidden');
            // Save dismissed state
            sessionStorage.setItem('riverside-emergency-dismissed', 'true');
        });
    }
    
    checkEmergencyAlerts() {
        // In a real implementation, this would fetch current alerts from an API
        const hasEmergency = this.simulateEmergencyCheck();
        const wasDismissed = sessionStorage.getItem('riverside-emergency-dismissed') === 'true';
        
        if (hasEmergency && !wasDismissed) {
            this.showEmergencyAlert('Flash flood warning in effect until 6 PM. Avoid low-lying areas.');
        }
    }
    
    simulateEmergencyCheck() {
        // Simulate random emergency for demo purposes
        return Math.random() > 0.7;
    }
    
    showEmergencyAlert(message) {
        const emergencyBanner = document.getElementById('emergency-banner');
        const emergencyMessage = document.getElementById('emergency-message');
        
        emergencyMessage.textContent = message;
        emergencyBanner.classList.remove('hidden');
        
        // Announce to screen readers
        this.announceToScreenReader(`Emergency Alert: ${message}`);
        
        // Focus management for accessibility
        setTimeout(() => {
            emergencyBanner.focus();
        }, 100);
    }
    
    // Service request tracking
    setupServiceTracking() {
        const trackingInput = document.querySelector('.tracking-input input');
        const trackButton = document.querySelector('.track-button');
        
        trackButton.addEventListener('click', () => {
            const trackingNumber = trackingInput.value.trim();
            if (trackingNumber) {
                this.trackServiceRequest(trackingNumber);
            } else {
                this.announceToScreenReader('Please enter a tracking number');
                trackingInput.focus();
            }
        });
        
        trackingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                trackButton.click();
            }
        });
    }
    
    trackServiceRequest(trackingNumber) {
        // In a real implementation, this would query the city's tracking system
        this.announceToScreenReader(`Looking up tracking number: ${trackingNumber}`);
        
        // Simulate tracking lookup
        console.log(`Tracking request: ${trackingNumber}`);
        alert(`This would look up tracking number: "${trackingNumber}"\nIn a real site, this would show the request status.`);
    }
    
    // Keyboard navigation enhancements
    setupKeyboardNavigation() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        const mainContent = document.getElementById('main-content');
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView();
        });
        
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close search suggestions
                this.hideSearchSuggestions(document.getElementById('search-suggestions'));
                
                // Close emergency banner if open
                const emergencyBanner = document.getElementById('emergency-banner');
                if (!emergencyBanner.classList.contains('hidden')) {
                    emergencyBanner.classList.add('hidden');
                }
            }
        });
        
        // Enhanced focus management for action cards
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            const button = card.querySelector('.action-button');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target === card) {
                    e.preventDefault();
                    button.click();
                }
            });
            
            // Make cards focusable for keyboard users
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        });
    }
    
    // Screen reader announcements
    announceToScreenReader(message) {
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
    
    // Utility method for form validation
    validateForm(formElement) {
        const requiredFields = formElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.setAttribute('aria-invalid', 'true');
                this.showFieldError(field, 'This field is required');
            } else {
                field.removeAttribute('aria-invalid');
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }
    
    showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Initialize the homepage functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RiversideHomepage();
});

// Service worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful');
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    // Log page load performance
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Report slow loading for optimization
        if (loadTime > 3000) {
            console.warn('Page load time exceeded 3 seconds');
        }
    }
});