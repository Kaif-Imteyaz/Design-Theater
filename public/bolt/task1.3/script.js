// Law Firm Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-open');
        });
    }
    
    // Client type selector functionality
    const clientTypes = document.querySelectorAll('.client-type');
    const practiceAreaSelect = document.getElementById('practiceArea');
    
    clientTypes.forEach(clientType => {
        clientType.addEventListener('click', function() {
            const type = this.dataset.type;
            
            // Remove active class from all client types
            clientTypes.forEach(ct => ct.classList.remove('active'));
            
            // Add active class to clicked type
            this.classList.add('active');
            
            // Update form
            const clientTypeSelect = document.getElementById('clientType');
            if (clientTypeSelect) {
                clientTypeSelect.value = type;
            }
            
            // Filter practice areas based on client type
            filterPracticeAreas(type);
            
            // Scroll to contact form
            document.getElementById('contact').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Filter practice areas based on client type
    function filterPracticeAreas(clientType) {
        const options = practiceAreaSelect.querySelectorAll('option');
        
        options.forEach(option => {
            if (option.value === '') return; // Keep default option
            
            if (clientType === 'individual') {
                // Show family, injury, estate for individuals
                if (['family', 'injury', 'estate'].includes(option.value)) {
                    option.style.display = 'block';
                    option.disabled = false;
                } else {
                    option.style.display = 'none';
                    option.disabled = true;
                }
            } else if (clientType === 'business') {
                // Show corporate for businesses
                if (option.value === 'corporate') {
                    option.style.display = 'block';
                    option.disabled = false;
                } else {
                    option.style.display = 'none';
                    option.disabled = true;
                }
            } else {
                // Show all options
                option.style.display = 'block';
                option.disabled = false;
            }
        });
    }
    
    // Practice area cards hover effects
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                alert('Thank you for your consultation request! We will contact you within 24 hours.');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                console.log('Form submitted:', formObject);
            }, 2000);
        });
    }
    
    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = stat.textContent;
                const isNumber = !isNaN(finalValue.replace(/[^\d]/g, ''));
                
                if (isNumber) {
                    animateCounter(stat, finalValue);
                }
                
                statsObserver.unobserve(stat);
            }
        });
    });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateCounter(element, finalValue) {
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        const suffix = finalValue.replace(/[\d]/g, '');
        const duration = 2000;
        const increment = numericValue / (duration / 16);
        let currentValue = 0;
        
        const counter = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                element.textContent = finalValue;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(currentValue) + suffix;
            }
        }, 16);
    }
    
    // Testimonials rotation (simple version)
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function rotateTestimonials() {
        if (testimonials.length > 1) {
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('active');
            });
            
            testimonials[currentTestimonial].classList.add('active');
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        }
    }
    
    // Rotate testimonials every 5 seconds
    setInterval(rotateTestimonials, 5000);
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        // Add background when scrolled
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Form validation enhancements
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearValidation(this);
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Remove existing validation
        clearValidation(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            showValidationError(field, `${getFieldLabel(fieldName)} is required`);
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showValidationError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showValidationError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }
    
    function showValidationError(field, message) {
        field.style.borderColor = 'var(--error-red)';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-red)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = 'var(--space-1)';
        
        field.parentNode.appendChild(errorElement);
    }
    
    function clearValidation(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function getFieldLabel(fieldName) {
        const labels = {
            'firstName': 'First Name',
            'lastName': 'Last Name',
            'email': 'Email',
            'phone': 'Phone',
            'clientType': 'Client Type',
            'practiceArea': 'Practice Area',
            'message': 'Message'
        };
        
        return labels[fieldName] || fieldName;
    }
    
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type !== 'submit') {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
    
    // Accessibility enhancements
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape' && mainNav.classList.contains('mobile-open')) {
            mainNav.classList.remove('mobile-open');
            mobileMenuToggle.focus();
        }
        
        // Enter key for client type selection
        if (e.key === 'Enter' && e.target.classList.contains('client-type')) {
            e.target.click();
        }
    });
    
    // Performance optimization: Lazy loading for images (when added)
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, observerOptions);
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Replace with actual analytics tracking
    console.log('Analytics Event:', { category, action, label });
}

// Add analytics tracking to important interactions
document.addEventListener('click', function(e) {
    const target = e.target;
    
    if (target.matches('.btn-primary, .btn-outline')) {
        trackEvent('Button', 'Click', target.textContent.trim());
    }
    
    if (target.matches('.client-type')) {
        trackEvent('Client Type', 'Select', target.dataset.type);
    }
    
    if (target.matches('.practice-link')) {
        trackEvent('Practice Area', 'Learn More', target.closest('.practice-card').querySelector('h3').textContent);
    }
});