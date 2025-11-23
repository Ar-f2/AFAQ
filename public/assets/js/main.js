/**
 * AFAQ CMS - Main JavaScript
 * نظام أفاق - JavaScript الرئيسي
 */

// ====== Configuration ======
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1';

// ====== Initialize AOS Animation ======
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
}

// ====== Mobile Navigation Toggle ======
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }
});

// ====== Header Scroll Effect ======
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ====== Back to Top Button ======
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ====== Smooth Scroll for Anchor Links ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ====== Counter Animation ======
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('ar-SA');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('ar-SA');
        }
    }, 16);
}

// Observe stat numbers and animate when visible
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

// ====== Load Featured Institutes ======
async function loadFeaturedInstitutes() {
    const grid = document.getElementById('institutesGrid');
    if (!grid) return;

    try {
        // Placeholder institutes (will be replaced with API call)
        const institutes = [
            {
                id: 1,
                name: 'معهد Bright',
                type: 'معهد لغة',
                logo: 'assets/images/bright-logo.png',
                description: 'معهد لغة إنجليزية معتمد في قلب كوالالمبور',
                location: 'كوالالمبور',
                rating: 4.8
            },
            {
                id: 2,
                name: 'معهد ELEC',
                type: 'معهد لغة',
                logo: 'assets/images/elec-logo.png',
                description: 'أحد أفضل معاهد اللغة في ماليزيا',
                location: 'كوالالمبور',
                rating: 4.7
            },
            {
                id: 3,
                name: 'معهد EMS',
                type: 'معهد لغة',
                logo: 'assets/images/ems-logo.png',
                description: 'معهد متخصص في تعليم اللغة الإنجليزية',
                location: 'صوبانج جايا',
                rating: 4.6
            }
        ];

        grid.innerHTML = institutes.map(inst => `
            <div class="institute-card" data-aos="fade-up">
                <div class="institute-image">
                    <img src="${inst.logo}" alt="${inst.name}" onerror="this.src='assets/images/default-institute.png'">
                    <span class="institute-badge">${inst.type}</span>
                </div>
                <div class="institute-content">
                    <h3 class="institute-name">${inst.name}</h3>
                    <p class="institute-location">
                        <i class="fas fa-map-marker-alt"></i> ${inst.location}
                    </p>
                    <p class="institute-description">${inst.description}</p>
                    <div class="institute-footer">
                        <div class="institute-rating">
                            <i class="fas fa-star"></i>
                            <span>${inst.rating}</span>
                        </div>
                        <a href="institute.html?id=${inst.id}" class="btn btn-primary">
                            التفاصيل <i class="fas fa-arrow-left"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading institutes:', error);
        grid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>عذراً، حدث خطأ في تحميل المعاهد</p>
            </div>
        `;
    }
}

// Load institutes on homepage
if (document.getElementById('institutesGrid')) {
    loadFeaturedInstitutes();
}

// ====== API Helper Functions ======
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'حدث خطأ في الاتصال');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ====== Track WhatsApp Click ======
async function trackWhatsAppClick(agentId) {
    try {
        // Get user info
        const userAgent = navigator.userAgent;
        const device = /Mobile|Android|iPhone/i.test(userAgent) ? 'Mobile'
                     : /iPad|Tablet/i.test(userAgent) ? 'Tablet'
                     : 'Desktop';

        // Detect OS
        let os = 'Unknown';
        if (userAgent.indexOf('Windows') > -1) os = 'Windows';
        else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
        else if (userAgent.indexOf('Android') > -1) os = 'Android';
        else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1) os = 'iOS';
        else if (userAgent.indexOf('Linux') > -1) os = 'Linux';

        // Detect Browser
        let browser = 'Unknown';
        if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
        else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

        // Send to API
        await fetchAPI('/agents/track-click', {
            method: 'POST',
            body: JSON.stringify({
                agentId,
                device,
                os,
                browser,
                referrer: document.referrer
            })
        });

        console.log('WhatsApp click tracked successfully');
    } catch (error) {
        console.error('Error tracking click:', error);
        // Don't block user if tracking fails
    }
}

// ====== Form Validation Helper ======
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return re.test(phone);
}

// ====== Show Toast Notification ======
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ====== Export Functions ======
window.AFAQ = {
    fetchAPI,
    trackWhatsAppClick,
    showToast,
    validateEmail,
    validatePhone
};

console.log('✅ AFAQ CMS JavaScript Loaded Successfully');
