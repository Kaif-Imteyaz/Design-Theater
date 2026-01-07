// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navCta.style.display = navCta.style.display === 'flex' ? 'none' : 'flex';
            
            // Toggle hamburger animation
            this.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinksElements = document.querySelectorAll('a[href^="#"]');
    navLinksElements.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    navCta.style.display = 'none';
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        // Add background when scrolled
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Form submission
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
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showMessage('Thank you for reaching out! Dr. Chen will respond within one business day. If this is an urgent matter, please call our office directly.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Log form data (remove in production)
                console.log('Form submitted:', formObject);
            }, 2000);
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .approach-item, .testimonial-card, .about-content, .hero-text');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
    
    // Scroll to top functionality
    let scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-sage);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
        } else {
            scrollToTopButton.style.opacity = '0';
        }
    });
    
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Message display function
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-medium);
        `;
        
        // Set background color based on type
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        
        messageDiv.style.backgroundColor = colors[type] || colors.info;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Animate in
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }
    
    // Initialize stats counter animation
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        const statsSection = document.querySelector('.hero-stats');
        
        if (!statsSection) return;
        
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach(stat => {
                        const finalValue = stat.textContent.replace(/[^\d]/g, '');
                        const duration = 2000; // 2 seconds
                        const increment = finalValue / (duration / 50);
                        let current = 0;
                        
                        const counter = setInterval(() => {
                            current += increment;
                            if (current >= finalValue) {
                                current = finalValue;
                                clearInterval(counter);
                            }
                            
                            // Format the number
                            const formatted = Math.floor(current).toString();
                            if (stat.textContent.includes('+')) {
                                stat.textContent = formatted + '+';
                            } else if (stat.textContent.includes('%')) {
                                stat.textContent = formatted + '%';
                            } else {
                                stat.textContent = formatted;
                            }
                        }, 50);
                    });
                    statsObserver.unobserve(statsSection);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // Initialize stats animation
    animateStats();
    
    // Add form validation
    const formInputs = document.querySelectorAll('#consultationForm input, #consultationForm select, #consultationForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error styling
        clearValidation(e);
        
        let isValid = true;
        let errorMessage = '';
        
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        if (!isValid) {
            field.style.borderColor = 'var(--error)';
            field.style.boxShadow = '0 0 0 3px rgba(244, 67, 54, 0.1)';
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errorMessage;
            errorDiv.style.cssText = 'color: var(--error); font-size: var(--font-size-xs); margin-top: var(--space-xs);';
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    function clearValidation(e) {
        const field = e.target;
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^\(?[\d\s\-\(\)\.]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    // Add accessibility improvements
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape' && navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
            navCta.style.display = 'none';
            mobileMenuToggle.classList.remove('active');
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// CSS for additional styling that needs to be added dynamically
const additionalStyles = `
    .header.scrolled {
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }
    
    .keyboard-navigation *:focus {
        outline: 3px solid var(--primary-sage) !important;
        outline-offset: 2px !important;
    }
    
    @media (max-width: 768px) {
        .nav-links,
        .nav-cta {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--neutral-white);
            box-shadow: var(--shadow-medium);
            padding: var(--space-md);
            flex-direction: column;
            gap: var(--space-sm);
            display: none !important;
        }
        
        .nav-links.show,
        .nav-cta.show {
            display: flex !important;
        }
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);