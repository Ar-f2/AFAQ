/**
 * AFAQ CMS - Agents Page JavaScript
 * صفحة الوكلاء مع نظام تتبع الواتساب
 */

// ====== Configuration ======
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1';

let allAgents = [];
let currentFilter = 'all';

// ====== Load Agents ======
async function loadAgents() {
    const grid = document.getElementById('agentsGrid');
    if (!grid) return;

    try {
        // TODO: Replace with actual API call
        // const response = await window.AFAQ.fetchAPI('/agents');
        // allAgents = response.data;

        // Placeholder agents data
        allAgents = [
            {
                _id: '1',
                name: 'أحمد محمد',
                specialty: 'معاهد اللغة',
                description: 'متخصص في التسجيل في معاهد اللغة الإنجليزية في ماليزيا. خبرة 5 سنوات في مساعدة الطلاب العرب.',
                photo: 'assets/images/agent-1.jpg',
                whatsapp: '+60123456789',
                email: 'ahmed@afaq.com',
                totalClicks: 150,
                isActive: true
            },
            {
                _id: '2',
                name: 'فاطمة علي',
                specialty: 'الجامعات',
                description: 'مستشارة تعليمية متخصصة في القبولات الجامعية. أساعد الطلاب في اختيار التخصص المناسب.',
                photo: 'assets/images/agent-2.jpg',
                whatsapp: '+60123456788',
                email: 'fatima@afaq.com',
                totalClicks: 200,
                isActive: true
            },
            {
                _id: '3',
                name: 'محمد السعيد',
                specialty: 'الدراسات العليا',
                description: 'متخصص في برامج الماجستير والدكتوراه. خبرة واسعة في المنح الدراسية.',
                photo: 'assets/images/agent-3.jpg',
                whatsapp: '+60123456787',
                email: 'mohammed@afaq.com',
                totalClicks: 120,
                isActive: true
            },
            {
                _id: '4',
                name: 'سارة حسن',
                specialty: 'التخصصات الطبية',
                description: 'مستشارة متخصصة في القبولات الطبية (طب، صيدلة، تمريض). أساعد في تحضير ملفات القبول.',
                photo: 'assets/images/agent-4.jpg',
                whatsapp: '+60123456786',
                email: 'sara@afaq.com',
                totalClicks: 180,
                isActive: true
            },
            {
                _id: '5',
                name: 'عمر خالد',
                specialty: 'التخصصات الهندسية',
                description: 'متخصص في الهندسة بجميع فروعها. خبرة في أفضل الجامعات الهندسية في ماليزيا.',
                photo: 'assets/images/agent-5.jpg',
                whatsapp: '+60123456785',
                email: 'omar@afaq.com',
                totalClicks: 160,
                isActive: true
            },
            {
                _id: '6',
                name: 'ليلى أحمد',
                specialty: 'إدارة الأعمال',
                description: 'مستشارة متخصصة في برامج إدارة الأعمال والتسويق. أساعد في التخطيط المهني.',
                photo: 'assets/images/agent-6.jpg',
                whatsapp: '+60123456784',
                email: 'laila@afaq.com',
                totalClicks: 140,
                isActive: true
            }
        ];

        displayAgents(allAgents);

    } catch (error) {
        console.error('Error loading agents:', error);
        grid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>عذراً، حدث خطأ في تحميل الوكلاء</p>
                <button class="btn btn-primary" onclick="loadAgents()">
                    إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// ====== Display Agents ======
function displayAgents(agents) {
    const grid = document.getElementById('agentsGrid');
    const noResults = document.getElementById('noResults');

    if (agents.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    grid.innerHTML = agents.map(agent => `
        <div class="agent-card" data-specialty="${agent.specialty}" data-aos="fade-up">
            <div class="agent-image-container">
                <img src="${agent.photo}"
                     alt="${agent.name}"
                     class="agent-image"
                     onerror="this.src='assets/images/default-avatar.png'">
                <span class="agent-specialty-badge">
                    <i class="fas fa-graduation-cap"></i>
                    ${agent.specialty}
                </span>
            </div>

            <div class="agent-content">
                <h3 class="agent-name">${agent.name}</h3>
                <p class="agent-title">
                    <i class="fas fa-user-tie"></i>
                    مستشار ${agent.specialty}
                </p>
                <p class="agent-description">${agent.description}</p>

                <div class="agent-stats">
                    <div class="agent-stat">
                        <i class="fas fa-chart-line"></i>
                        <span><strong>${agent.totalClicks}</strong> استشارة</span>
                    </div>
                    <div class="agent-stat">
                        <i class="fas fa-check-circle"></i>
                        <span>متاح الآن</span>
                    </div>
                </div>

                <div class="agent-actions">
                    <button class="btn-whatsapp" onclick="contactAgent('${agent._id}', '${agent.whatsapp}', '${agent.name}')">
                        <i class="fab fa-whatsapp"></i>
                        تواصل عبر واتساب
                    </button>
                    ${agent.email ? `
                        <a href="mailto:${agent.email}"
                           class="btn-email"
                           title="إرسال بريد إلكتروني">
                            <i class="fas fa-envelope"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    // Refresh AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// ====== Filter Agents ======
function filterAgents(specialty) {
    currentFilter = specialty;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter agents
    const filtered = specialty === 'all'
        ? allAgents
        : allAgents.filter(agent => agent.specialty === specialty);

    displayAgents(filtered);

    // Scroll to grid
    document.getElementById('agentsGrid').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ====== Reset Filter ======
function resetFilter() {
    currentFilter = 'all';
    document.querySelector('.filter-btn[data-filter="all"]').click();
}

// ====== Contact Agent via WhatsApp ======
async function contactAgent(agentId, whatsappNumber, agentName) {
    try {
        // Add clicked animation
        event.target.classList.add('clicked');
        setTimeout(() => event.target.classList.remove('clicked'), 600);

        // Track the click
        await trackWhatsAppClick(agentId);

        // Prepare WhatsApp message
        const message = encodeURIComponent(
            `السلام عليكم ${agentName},\n` +
            `أود الاستفسار عن خدمات شركة أفاق للدراسة في ماليزيا.`
        );

        // Clean phone number
        const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');

        // Open WhatsApp
        const whatsappURL = /Mobile|Android|iPhone/i.test(navigator.userAgent)
            ? `whatsapp://send?phone=${cleanNumber}&text=${message}`
            : `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${message}`;

        window.open(whatsappURL, '_blank');

        // Show success message
        if (window.AFAQ && window.AFAQ.showToast) {
            window.AFAQ.showToast('جاري فتح واتساب...', 'success');
        }

    } catch (error) {
        console.error('Error contacting agent:', error);

        // Even if tracking fails, still open WhatsApp
        const message = encodeURIComponent(
            `السلام عليكم ${agentName},\n` +
            `أود الاستفسار عن خدمات شركة أفاق للدراسة في ماليزيا.`
        );
        const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');
        const whatsappURL = /Mobile|Android|iPhone/i.test(navigator.userAgent)
            ? `whatsapp://send?phone=${cleanNumber}&text=${message}`
            : `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${message}`;

        window.open(whatsappURL, '_blank');
    }
}

// ====== Track WhatsApp Click ======
async function trackWhatsAppClick(agentId) {
    try {
        // Get user info
        const userAgent = navigator.userAgent;

        // Detect device
        let device = 'Unknown';
        if (/Mobile|Android|iPhone/i.test(userAgent)) {
            device = 'Mobile';
        } else if (/iPad|Tablet/i.test(userAgent)) {
            device = 'Tablet';
        } else {
            device = 'Desktop';
        }

        // Detect OS
        let os = 'Unknown';
        if (userAgent.indexOf('Windows') > -1) os = 'Windows';
        else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
        else if (userAgent.indexOf('Android') > -1) os = 'Android';
        else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1) os = 'iOS';
        else if (userAgent.indexOf('Linux') > -1) os = 'Linux';

        // Detect Browser
        let browser = 'Unknown';
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) browser = 'Chrome';
        else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) browser = 'Safari';
        else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (userAgent.indexOf('Edg') > -1) browser = 'Edge';

        // Prepare tracking data
        const trackingData = {
            agentId,
            device,
            os,
            browser,
            referrer: document.referrer || 'direct',
            userAgent: userAgent
        };

        // Send to API
        const response = await fetch(`${API_BASE_URL}/agents/track-click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trackingData)
        });

        if (response.ok) {
            console.log('✅ WhatsApp click tracked successfully');
        } else {
            console.warn('⚠️ Click tracking response:', response.status);
        }

    } catch (error) {
        console.error('❌ Error tracking WhatsApp click:', error);
        // Don't block the user if tracking fails
    }
}

// ====== Initialize Filter Buttons ======
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterAgents(filter);
        });
    });
}

// ====== Search Agents (Optional Enhancement) ======
function searchAgents(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allAgents.filter(agent =>
        agent.name.toLowerCase().includes(term) ||
        agent.specialty.toLowerCase().includes(term) ||
        agent.description.toLowerCase().includes(term)
    );

    displayAgents(filtered);
}

// ====== Initialize Page ======
document.addEventListener('DOMContentLoaded', function() {
    // Load agents
    loadAgents();

    // Initialize filters
    initializeFilters();

    // Add search functionality if search input exists
    const searchInput = document.getElementById('agentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchAgents(e.target.value);
        });
    }

    console.log('✅ Agents page initialized');
});

// ====== Export Functions ======
window.AgentsPage = {
    loadAgents,
    filterAgents,
    contactAgent,
    searchAgents,
    resetFilter
};
