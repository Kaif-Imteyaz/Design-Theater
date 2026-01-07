// Metro Daily News - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Current date display
    function updateDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('en-US', options);
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }
    
    // Language toggle functionality
    let currentLang = 'en';
    const langToggle = document.getElementById('lang-toggle');
    const translations = {
        en: {
            breaking: 'BREAKING',
            sections: {
                politics: 'Politics',
                business: 'Business', 
                sports: 'Sports',
                community: 'Community'
            },
            ui: {
                search: 'Search news...',
                loadMore: 'Load More Articles',
                subscribe: 'Subscribe',
                newsletter: 'Newsletter',
                mostRead: 'Most Read Today',
                premium: 'Premium Investigative',
                subscribersOnly: 'Subscribers Only',
                latestPodcast: 'Latest Podcast',
                stayInformed: 'Stay Informed'
            }
        },
        es: {
            breaking: 'ÚLTIMA HORA',
            sections: {
                politics: 'Política',
                business: 'Negocios',
                sports: 'Deportes', 
                community: 'Comunidad'
            },
            ui: {
                search: 'Buscar noticias...',
                loadMore: 'Cargar Más Artículos',
                subscribe: 'Suscribirse',
                newsletter: 'Boletín',
                mostRead: 'Más Leído Hoy',
                premium: 'Investigación Premium',
                subscribersOnly: 'Solo Suscriptores',
                latestPodcast: 'Último Podcast',
                stayInformed: 'Mantente Informado'
            }
        }
    };
    
    function toggleLanguage() {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        langToggle.textContent = currentLang === 'en' ? 'ES' : 'EN';
        langToggle.setAttribute('aria-label', 
            currentLang === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'
        );
        
        // Update document language
        document.documentElement.lang = currentLang;
        
        // Update UI text based on language
        updateUIText();
    }
    
    function updateUIText() {
        const t = translations[currentLang];
        
        // Update breaking news label
        const breakingLabel = document.querySelector('.breaking-label');
        if (breakingLabel) breakingLabel.textContent = t.breaking;
        
        // Update search placeholder
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.placeholder = t.ui.search;
        
        // Update load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) loadMoreBtn.textContent = t.ui.loadMore;
        
        // Update sidebar headings
        const mostReadHeading = document.querySelector('.trending-section h3');
        if (mostReadHeading) mostReadHeading.textContent = t.ui.mostRead;
        
        const premiumHeading = document.querySelector('.premium-section h3');
        if (premiumHeading) premiumHeading.textContent = t.ui.premium;
        
        const podcastHeading = document.querySelector('.podcast-section h3');
        if (podcastHeading) podcastHeading.textContent = t.ui.latestPodcast;
        
        const newsletterHeading = document.querySelector('.newsletter-section h3');
        if (newsletterHeading) newsletterHeading.textContent = t.ui.stayInformed;
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    function toggleMobileMenu() {
        mainNav.classList.toggle('mobile-open');
        mobileMenuToggle.setAttribute('aria-expanded', 
            mainNav.classList.contains('mobile-open') ? 'true' : 'false'
        );
    }
    
    // Search functionality
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('search-input');
    
    function handleSearch(event) {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // Simulate search - in real implementation, this would make an API call
            console.log('Searching for:', query);
            // You could implement actual search functionality here
            filterArticles(query);
        }
    }
    
    // Article filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    
    function filterArticles(filter) {
        // Handle search query
        if (typeof filter === 'string' && filter.length > 0) {
            articleCards.forEach(card => {
                const title = card.querySelector('.article-title').textContent.toLowerCase();
                const excerpt = card.querySelector('.article-excerpt')?.textContent.toLowerCase() || '';
                const category = card.dataset.category.toLowerCase();
                
                if (title.includes(filter.toLowerCase()) || 
                    excerpt.includes(filter.toLowerCase()) || 
                    category.includes(filter.toLowerCase())) {
                    card.style.display = '';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
            return;
        }
        
        // Handle category filter
        filterBtns.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        articleCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = '';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    
    function handleNewsletterSubmission(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const checkboxes = document.querySelectorAll('.newsletter-options input[type="checkbox"]:checked');
        const selectedPreferences = Array.from(checkboxes).map(cb => cb.parentElement.textContent.trim());
        
        // Simulate subscription
        console.log('Newsletter subscription:', { email, preferences: selectedPreferences });
        
        // Show success message (in real implementation, handle server response)
        const button = event.target.querySelector('button');
        const originalText = button.textContent;
        button.textContent = currentLang === 'en' ? 'Subscribed!' : '¡Suscrito!';
        button.style.background = '#228B22';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
    
    // Load more articles functionality
    const loadMoreBtn = document.getElementById('load-more');
    let articlesLoaded = 6; // Initial articles shown
    const articlesPerLoad = 6;
    
    function loadMoreArticles() {
        // Simulate loading more articles
        loadMoreBtn.textContent = currentLang === 'en' ? 'Loading...' : 'Cargando...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            articlesLoaded += articlesPerLoad;
            
            // In real implementation, you would fetch more articles from your API
            console.log(`Loaded ${articlesLoaded} articles`);
            
            // Reset button
            loadMoreBtn.textContent = currentLang === 'en' ? 'Load More Articles' : 'Cargar Más Artículos';
            loadMoreBtn.disabled = false;
            
            // Simulate running out of articles after 18 total
            if (articlesLoaded >= 18) {
                loadMoreBtn.textContent = currentLang === 'en' ? 'No More Articles' : 'No Más Artículos';
                loadMoreBtn.disabled = true;
            }
        }, 1000);
    }
    
    // Back to top functionality
    const backToTopBtn = document.getElementById('back-to-top');
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Share functionality
    function handleShare(event) {
        if (event.target.classList.contains('share-btn')) {
            const article = event.target.closest('article');
            const title = article.querySelector('h2, h3, h4')?.textContent || 'Metro Daily News Article';
            const url = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                }).catch(console.error);
            } else {
                // Fallback for browsers that don't support Web Share API
                navigator.clipboard.writeText(url).then(() => {
                    const button = event.target;
                    const originalText = button.textContent;
                    button.textContent = currentLang === 'en' ? 'Copied!' : '¡Copiado!';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 1500);
                });
            }
        }
    }
    
    // Save article functionality
    function handleSave(event) {
        if (event.target.classList.contains('save-btn')) {
            const article = event.target.closest('article');
            const title = article.querySelector('h2, h3, h4')?.textContent || 'Untitled Article';
            
            // Get saved articles from localStorage or initialize empty array
            const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
            
            // Check if article is already saved
            const articleId = title.replace(/\s+/g, '-').toLowerCase();
            const isAlreadySaved = savedArticles.some(saved => saved.id === articleId);
            
            if (!isAlreadySaved) {
                // Save article
                savedArticles.push({
                    id: articleId,
                    title: title,
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                });
                localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
                
                // Update button text
                const button = event.target;
                button.textContent = currentLang === 'en' ? 'Saved!' : '¡Guardado!';
                button.style.background = '#228B22';
                button.style.borderColor = '#228B22';
                button.style.color = 'white';
                
                setTimeout(() => {
                    button.textContent = currentLang === 'en' ? 'Save' : 'Guardar';
                    button.style.background = '';
                    button.style.borderColor = '';
                    button.style.color = '';
                }, 2000);
            } else {
                // Article already saved
                const button = event.target;
                button.textContent = currentLang === 'en' ? 'Already saved' : 'Ya guardado';
                setTimeout(() => {
                    button.textContent = currentLang === 'en' ? 'Save' : 'Guardar';
                }, 1500);
            }
        }
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe article cards for animation
    document.querySelectorAll('.article-card, .secondary-story').forEach(card => {
        observer.observe(card);
    });
    
    // Podcast play functionality
    function handlePodcastPlay() {
        const playBtn = document.querySelector('.play-btn');
        if (playBtn.textContent === '▶') {
            playBtn.textContent = '⏸';
            playBtn.setAttribute('aria-label', 'Pause podcast');
            // In real implementation, start audio playback
            console.log('Playing podcast');
        } else {
            playBtn.textContent = '▶';
            playBtn.setAttribute('aria-label', 'Play podcast');
            // In real implementation, pause audio playback
            console.log('Pausing podcast');
        }
    }
    
    // Navigation active state based on scroll position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 120 && sectionTop > -section.offsetHeight + 120) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Event listeners
    langToggle.addEventListener('click', toggleLanguage);
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    searchForm.addEventListener('submit', handleSearch);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterArticles(btn.dataset.filter);
        });
    });
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreArticles);
    }
    
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // Delegate share and save events
    document.addEventListener('click', handleShare);
    document.addEventListener('click', handleSave);
    
    // Podcast play button
    const podcastPlayBtn = document.querySelector('.play-btn');
    if (podcastPlayBtn) {
        podcastPlayBtn.addEventListener('click', handlePodcastPlay);
    }
    
    // Scroll events
    window.addEventListener('scroll', () => {
        toggleBackToTop();
        updateActiveNavigation();
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', (event) => {
        // ESC key closes mobile menu
        if (event.key === 'Escape' && mainNav.classList.contains('mobile-open')) {
            toggleMobileMenu();
        }
        
        // Enter key on filter buttons
        if (event.key === 'Enter' && event.target.classList.contains('filter-btn')) {
            filterArticles(event.target.dataset.filter);
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (mainNav.classList.contains('mobile-open') && 
            !mainNav.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            toggleMobileMenu();
        }
    });
    
    // Initialize
    updateDate();
    updateUIText();
    toggleBackToTop();
    updateActiveNavigation();
    
    // Update date every hour
    setInterval(updateDate, 3600000);
});