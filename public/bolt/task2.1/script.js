// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Hero CTA button actions
    const exploreBtn = document.querySelector('.hero-cta .btn-primary');
    const storyBtn = document.querySelector('.hero-cta .btn-secondary');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            document.querySelector('#collections').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    if (storyBtn) {
        storyBtn.addEventListener('click', function() {
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulate newsletter signup
                showNotification('Thank you for subscribing! We\'ll keep you updated on our latest collections.');
                this.reset();
            }
        });
    }
    
    // Collection card interactions
    document.querySelectorAll('.collection-card').forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            showNotification(`Exploring ${cardTitle} - Coming soon!`);
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.collection-card, .ethics-card, .about-content > *, .section-header').forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        .collection-card,
        .ethics-card,
        .about-content > *,
        .section-header {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Notification system
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: var(--primary-color);
            color: var(--white);
            padding: 16px 24px;
            border-radius: 4px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            font-family: var(--font-primary);
            font-weight: 300;
            line-height: 1.4;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Add hover effects for interactive elements
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image img');
        
        if (heroImage) {
            const speed = scrolled * 0.5;
            heroImage.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add loading styles
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
            body:not(.loaded) * {
                animation-play-state: paused !important;
            }
            
            .loaded {
                animation: none;
            }
        `;
        document.head.appendChild(loadingStyle);
    });
});