// Global state
let currentLanguage = 'en';
let isNavOpen = false;

// Sample doctor data
const doctorsData = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "cardiology",
        location: "downtown",
        phone: "(555) 123-4567",
        languages: ["en", "es"]
    },
    {
        id: 2,
        name: "Dr. Miguel Rodriguez", 
        specialty: "emergency",
        location: "northside",
        phone: "(555) 123-4568",
        languages: ["en", "es"]
    },
    {
        id: 3,
        name: "Dr. Jennifer Chen",
        specialty: "pediatrics", 
        location: "westend",
        phone: "(555) 123-4569",
        languages: ["en"]
    },
    {
        id: 4,
        name: "Dr. Robert Smith",
        specialty: "family",
        location: "downtown", 
        phone: "(555) 123-4570",
        languages: ["en"]
    },
    {
        id: 5,
        name: "Dr. Maria Gonzalez",
        specialty: "internal",
        location: "northside",
        phone: "(555) 123-4571", 
        languages: ["en", "es"]
    }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupAccessibility();
    setupEventListeners();
});

function initializeApp() {
    // Set initial language
    updateLanguage(currentLanguage);
    
    // Check if emergency banner was previously closed
    const emergencyBannerClosed = localStorage.getItem('emergencyBannerClosed');
    if (emergencyBannerClosed === 'true') {
        closeEmergencyBanner();
    }
    
    // Initialize placeholders
    updatePlaceholders();
}

function setupAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = currentLanguage === 'en' ? 'Skip to main content' : 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main';
        main.setAttribute('role', 'main');
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('doctorSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', debounce(performSearch, 300));
    }
    
    // Filter changes
    const specialtyFilter = document.getElementById('specialtyFilter');
    const locationFilter = document.getElementById('locationFilter');
    
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', performSearch);
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('change', performSearch);
    }
    
    // Keyboard navigation for cards
    document.querySelectorAll('.user-card, .resource-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Language Functions
function toggleLanguage(lang) {
    currentLanguage = lang;
    updateLanguage(lang);
    updatePlaceholders();
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Announce language change to screen readers
    announceToScreenReader(
        lang === 'en' 
            ? 'Language changed to English' 
            : 'Idioma cambiado a Español'
    );
}

function updateLanguage(lang) {
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update document language
    document.documentElement.lang = lang;
}

function updatePlaceholders() {
    const searchInput = document.getElementById('doctorSearch');
    if (searchInput) {
        const placeholder = searchInput.getAttribute(`data-placeholder-${currentLanguage}`);
        if (placeholder) {
            searchInput.placeholder = placeholder;
        }
    }
}

// Navigation Functions
function toggleMobileNav() {
    const navList = document.querySelector('.nav-list');
    isNavOpen = !isNavOpen;
    
    if (isNavOpen) {
        navList.classList.add('active');
        navList.style.display = 'flex';
        
        // Focus first nav item
        const firstNavItem = navList.querySelector('a');
        if (firstNavItem) {
            firstNavItem.focus();
        }
    } else {
        navList.classList.remove('active');
        navList.style.display = 'none';
    }
    
    // Update aria attributes
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.setAttribute('aria-expanded', isNavOpen);
    
    announceToScreenReader(
        isNavOpen 
            ? (currentLanguage === 'en' ? 'Navigation menu opened' : 'Menú de navegación abierto')
            : (currentLanguage === 'en' ? 'Navigation menu closed' : 'Menú de navegación cerrado')
    );
}

function navigateToSection(sectionType) {
    let url = '#';
    let message = '';
    
    switch(sectionType) {
        case 'patients':
            url = '#find-doctor';
            message = currentLanguage === 'en' 
                ? 'Navigating to patient services' 
                : 'Navegando a servicios para pacientes';
            break;
        case 'physicians':
            url = '#services';
            message = currentLanguage === 'en' 
                ? 'Navigating to professional services' 
                : 'Navegando a servicios profesionales';
            break;
        case 'careers':
            message = currentLanguage === 'en' 
                ? 'Opening career opportunities' 
                : 'Abriendo oportunidades profesionales';
            openCareers();
            return;
        case 'emergency':
            showEmergencyInfo();
            return;
    }
    
    announceToScreenReader(message);
    
    if (url !== '#') {
        const targetElement = document.querySelector(url);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            // Focus the section for accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
        }
    }
}

// Emergency Functions
function closeEmergencyBanner() {
    const banner = document.getElementById('emergencyBanner');
    if (banner) {
        banner.style.display = 'none';
        localStorage.setItem('emergencyBannerClosed', 'true');
        
        announceToScreenReader(
            currentLanguage === 'en' 
                ? 'Emergency banner closed' 
                : 'Banner de emergencia cerrado'
        );
    }
}

function showEmergencyInfo() {
    showModal('emergencyModal');
    
    announceToScreenReader(
        currentLanguage === 'en' 
            ? 'Emergency information opened' 
            : 'Información de emergencia abierta'
    );
}

function findNearestER() {
    // In a real implementation, this would use geolocation
    const message = currentLanguage === 'en' 
        ? 'Finding nearest emergency room...' 
        : 'Encontrando sala de emergencia más cercana...';
    
    announceToScreenReader(message);
    
    // Simulate navigation to location finder
    setTimeout(() => {
        const locationMessage = currentLanguage === 'en'
            ? 'Downtown Medical Center - 123 Medical Plaza - 2.1 miles away'
            : 'Centro Médico del Centro - 123 Medical Plaza - 2.1 millas de distancia';
        
        alert(locationMessage);
    }, 1500);
}

// Search Functions
function searchDoctors() {
    const query = document.getElementById('doctorSearch').value.toLowerCase();
    const specialty = document.getElementById('specialtyFilter').value;
    const location = document.getElementById('locationFilter').value;
    
    let filteredDoctors = doctorsData.filter(doctor => {
        const matchesQuery = !query || 
            doctor.name.toLowerCase().includes(query) || 
            doctor.specialty.toLowerCase().includes(query);
        
        const matchesSpecialty = !specialty || doctor.specialty === specialty;
        const matchesLocation = !location || doctor.location === location;
        
        return matchesQuery && matchesSpecialty && matchesLocation;
    });
    
    displaySearchResults(filteredDoctors);
    
    announceToScreenReader(
        currentLanguage === 'en' 
            ? `Found ${filteredDoctors.length} doctors` 
            : `Se encontraron ${filteredDoctors.length} médicos`
    );
}

function performSearch() {
    searchDoctors();
}

function displaySearchResults(doctors) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (doctors.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>${currentLanguage === 'en' ? 'No doctors found matching your criteria.' : 'No se encontraron médicos que coincidan con sus criterios.'}</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = doctors.map(doctor => `
        <div class="doctor-card" tabindex="0" role="button" onclick="viewDoctorDetails(${doctor.id})" onkeydown="handleCardKeydown(event, ${doctor.id})">
            <h3>${doctor.name}</h3>
            <p class="specialty">${getSpecialtyName(doctor.specialty)}</p>
            <p class="location">${getLocationName(doctor.location)}</p>
            <p class="phone">${doctor.phone}</p>
            <div class="doctor-actions">
                <button onclick="bookAppointmentWithDoctor(${doctor.id})" class="book-btn">
                    ${currentLanguage === 'en' ? 'Book Appointment' : 'Programar Cita'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Add styles for doctor cards
    const style = document.createElement('style');
    style.textContent = `
        .doctor-card {
            background: white;
            border: 2px solid var(--neutral-200);
            border-radius: var(--spacing-3);
            padding: var(--spacing-6);
            margin-bottom: var(--spacing-4);
            transition: all var(--transition-fast);
            cursor: pointer;
        }
        .doctor-card:hover, .doctor-card:focus {
            border-color: var(--primary-blue);
            box-shadow: var(--shadow-md);
        }
        .doctor-card h3 {
            color: var(--primary-blue);
            margin-bottom: var(--spacing-2);
        }
        .doctor-card .specialty {
            color: var(--secondary-green);
            font-weight: 500;
            margin-bottom: var(--spacing-1);
        }
        .doctor-card .location,
        .doctor-card .phone {
            color: var(--neutral-600);
            margin-bottom: var(--spacing-1);
        }
        .doctor-actions {
            margin-top: var(--spacing-4);
        }
        .book-btn {
            background: var(--primary-blue);
            color: white;
            border: none;
            padding: var(--spacing-2) var(--spacing-4);
            border-radius: var(--spacing-1);
            cursor: pointer;
            font-size: var(--font-size-sm);
            transition: background var(--transition-fast);
        }
        .book-btn:hover {
            background: var(--primary-blue-dark);
        }
        .no-results {
            text-align: center;
            padding: var(--spacing-8);
            color: var(--neutral-600);
        }
    `;
    
    if (!document.querySelector('#doctor-card-styles')) {
        style.id = 'doctor-card-styles';
        document.head.appendChild(style);
    }
}

function getSpecialtyName(specialty) {
    const specialtyNames = {
        'cardiology': currentLanguage === 'en' ? 'Cardiology' : 'Cardiología',
        'emergency': currentLanguage === 'en' ? 'Emergency Medicine' : 'Medicina de Emergencia',
        'pediatrics': currentLanguage === 'en' ? 'Pediatrics' : 'Pediatría',
        'family': currentLanguage === 'en' ? 'Family Medicine' : 'Medicina Familiar',
        'internal': currentLanguage === 'en' ? 'Internal Medicine' : 'Medicina Interna',
        'surgery': currentLanguage === 'en' ? 'Surgery' : 'Cirugía'
    };
    return specialtyNames[specialty] || specialty;
}

function getLocationName(location) {
    const locationNames = {
        'downtown': currentLanguage === 'en' ? 'Downtown Medical Center' : 'Centro Médico del Centro',
        'northside': currentLanguage === 'en' ? 'Northside Hospital' : 'Hospital Northside', 
        'westend': currentLanguage === 'en' ? 'West End Clinic' : 'Clínica West End'
    };
    return locationNames[location] || location;
}

function handleCardKeydown(event, doctorId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        viewDoctorDetails(doctorId);
    }
}

function viewDoctorDetails(doctorId) {
    const doctor = doctorsData.find(d => d.id === doctorId);
    if (doctor) {
        const message = currentLanguage === 'en' 
            ? `Viewing details for ${doctor.name}` 
            : `Viendo detalles de ${doctor.name}`;
        
        announceToScreenReader(message);
        
        // In a real implementation, this would open a detailed view
        alert(message);
    }
}

// Action Functions
function bookAppointment() {
    announceToScreenReader(
        currentLanguage === 'en' 
            ? 'Opening appointment booking system' 
            : 'Abriendo sistema de citas médicas'
    );
    
    // In a real implementation, this would open the booking system
    alert(currentLanguage === 'en' 
        ? 'Appointment booking system will open here' 
        : 'El sistema de citas médicas se abrirá aquí');
}

function bookAppointmentWithDoctor(doctorId) {
    const doctor = doctorsData.find(d => d.id === doctorId);
    if (doctor) {
        const message = currentLanguage === 'en' 
            ? `Booking appointment with ${doctor.name}` 
            : `Programando cita con ${doctor.name}`;
        
        announceToScreenReader(message);
        alert(message);
    }
}

function openPatientPortal() {
    announceToScreenReader(
        currentLanguage === 'en' 
            ? 'Opening patient portal' 
            : 'Abriendo portal del paciente'
    );
    
    // In a real implementation, this would redirect to the portal
    window.open('#portal', '_blank');
}

function openBilling() {
    announceToScreenReader(
        currentLanguage === 'en' 
            ? 'Opening billing portal' 
            : 'Abriendo portal de facturación'
    );
    
    // In a real implementation, this would redirect to billing
    window.open('#billing', '_blank');
}

function openCareers() {
    announceToScreenReader(
        currentLanguage === 'en' 
            ? 'Opening career opportunities' 
            : 'Abriendo oportunidades profesionales'
    );
    
    // In a real implementation, this would redirect to careers page
    window.open('#careers', '_blank');
}

function openResource(resourceType) {
    const messages = {
        'billing': currentLanguage === 'en' ? 'Opening billing information' : 'Abriendo información de facturación',
        'portal': currentLanguage === 'en' ? 'Opening patient portal' : 'Abriendo portal del paciente',
        'education': currentLanguage === 'en' ? 'Opening health education resources' : 'Abriendo recursos de educación médica',
        'visiting': currentLanguage === 'en' ? 'Opening visiting information' : 'Abriendo información de visitas'
    };
    
    announceToScreenReader(messages[resourceType]);
    
    // In a real implementation, these would navigate to specific pages
    window.open(`#${resourceType}`, '_blank');
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Focus the modal
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.setAttribute('tabindex', '-1');
            modalContent.focus();
        }
        
        // Trap focus within modal
        trapFocus(modal);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        
        // Return focus to the element that opened the modal
        const trigger = document.querySelector('[onclick*="' + modalId + '"]');
        if (trigger) {
            trigger.focus();
        }
    }
}

function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    // Clean up after announcement
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

// Performance optimization - lazy load images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    
    // Show user-friendly error message
    const errorMessage = currentLanguage === 'en' 
        ? 'An error occurred. Please refresh the page or contact support if the problem persists.' 
        : 'Ocurrió un error. Por favor actualice la página o contacte soporte si el problema persiste.';
    
    // Only show alert for critical errors
    if (e.error && e.error.name !== 'ResizeObserver loop limit exceeded') {
        alert(errorMessage);
    }
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // In a real implementation, this would send data to analytics service
    console.log('Event tracked:', eventName, eventData);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleLanguage,
        searchDoctors,
        showEmergencyInfo,
        debounce,
        announceToScreenReader
    };
}