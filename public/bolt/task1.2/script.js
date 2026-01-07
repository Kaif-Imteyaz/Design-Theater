// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Class Schedule Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const scheduleCards = document.querySelectorAll('.schedule-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        scheduleCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                if (card.getAttribute('data-type') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Smooth Scrolling for Navigation Links
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

// Form Handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const interest = contactForm.querySelector('select').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !phone) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your interest! We\'ll contact you within 24 hours to schedule your free trial.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Membership Plan Selection
document.querySelectorAll('.membership-card .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.membership-card');
        const planName = card.querySelector('h3').textContent;
        alert(`You've selected the ${planName} plan! Please call us at (555) 123-4567 to complete your membership registration.`);
    });
});

// Hero CTA Buttons
document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.textContent === 'Start Your Free Trial') {
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        } else if (btn.textContent === 'View Class Schedule') {
            document.querySelector('#classes').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes and observe elements
document.addEventListener('DOMContentLoaded', () => {
    // Animate differentiator cards
    document.querySelectorAll('.diff-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Animate trainer cards
    document.querySelectorAll('.trainer-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.15}s`;
        observer.observe(card);
    });
    
    // Animate schedule cards
    document.querySelectorAll('.schedule-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate membership cards
    document.querySelectorAll('.membership-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Animate testimonial cards
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Animate philosophy section
    const philosophyText = document.querySelector('.philosophy-text');
    const philosophyImage = document.querySelector('.philosophy-image');
    
    if (philosophyText && philosophyImage) {
        philosophyText.classList.add('slide-in-left');
        philosophyImage.classList.add('slide-in-right');
        observer.observe(philosophyText);
        observer.observe(philosophyImage);
    }
});

// Navbar Background on Scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Add CSS keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);