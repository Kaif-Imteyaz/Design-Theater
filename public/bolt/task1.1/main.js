// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.feature, .menu-item, .info-card');
    
    // Set initial state for animations
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add hover effects for menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8f8f8';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#ffffff';
    });
});

// Dynamic current time for hours display
function updateCurrentStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 100 + minute; // Convert to HHMM format
    
    let isOpen = false;
    let nextOpen = '';
    
    // Check if currently open
    if (day >= 1 && day <= 5) { // Monday - Friday
        isOpen = currentTime >= 600 && currentTime < 2000; // 6:00 AM - 8:00 PM
        if (!isOpen && currentTime < 600) nextOpen = 'Opens at 6:00 AM';
        if (!isOpen && currentTime >= 2000) nextOpen = 'Opens tomorrow at 6:00 AM';
    } else if (day === 6) { // Saturday
        isOpen = currentTime >= 700 && currentTime < 2100; // 7:00 AM - 9:00 PM
        if (!isOpen && currentTime < 700) nextOpen = 'Opens at 7:00 AM';
        if (!isOpen && currentTime >= 2100) nextOpen = 'Opens tomorrow at 7:00 AM';
    } else { // Sunday
        isOpen = currentTime >= 700 && currentTime < 1900; // 7:00 AM - 7:00 PM
        if (!isOpen && currentTime < 700) nextOpen = 'Opens at 7:00 AM';
        if (!isOpen && currentTime >= 1900) nextOpen = 'Opens tomorrow at 6:00 AM';
    }
    
    // Add status indicator to hours section
    const hoursCard = document.querySelector('.info-card:has(.hours)');
    if (hoursCard && !hoursCard.querySelector('.status-indicator')) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'status-indicator';
        statusDiv.innerHTML = isOpen 
            ? '<span style="color: #22c55e; font-weight: bold;">🟢 Open Now</span>'
            : `<span style="color: #ef4444; font-weight: bold;">🔴 Closed${nextOpen ? ' - ' + nextOpen : ''}</span>`;
        hoursCard.appendChild(statusDiv);
    }
}

// Update status on page load
document.addEventListener('DOMContentLoaded', updateCurrentStatus);