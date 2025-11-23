/**
 * AFAQ CMS - Admin Registrations Management
 * إدارة طلبات التسجيل
 */

// ====== Configuration ======
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1';

// ====== State ======
let allRegistrations = [];
let filteredRegistrations = [];
let currentPage = 1;
const itemsPerPage = 20;
let adminToken = null;
let adminUser = null;

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    adminToken = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');

    if (!adminToken) {
        window.location.href = 'login.html';
        return;
    }

    if (userStr) {
        adminUser = JSON.parse(userStr);
        document.getElementById('adminName').textContent = adminUser.name || 'المسؤول';
    }

    // Load registrations
    loadRegistrations();

    console.log('✅ Admin registrations initialized');
});

// ====== Load Registrations ======
async function loadRegistrations() {
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = 'login.html';
            return;
        }

        const result = await response.json();

        if (response.ok && result.success) {
            allRegistrations = result.data || [];
            filteredRegistrations = [...allRegistrations];

            // Update stats
            updateStats();

            // Display registrations
            displayRegistrations();

        } else {
            throw new Error(result.message || 'فشل تحميل البيانات');
        }

    } catch (error) {
        console.error('Load registrations error:', error);
        showEmptyState();
        alert('حدث خطأ أثناء تحميل البيانات: ' + error.message);
    } finally {
        hideLoading();
    }
}

// ====== Update Statistics ======
function updateStats() {
    const total = allRegistrations.length;
    const newCount = allRegistrations.filter(r => r.status === 'جديد').length;
    const reviewCount = allRegistrations.filter(r => r.status === 'قيد المراجعة').length;

    // Count today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = allRegistrations.filter(r => {
        const regDate = new Date(r.createdAt);
        regDate.setHours(0, 0, 0, 0);
        return regDate.getTime() === today.getTime();
    }).length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('newCount').textContent = newCount;
    document.getElementById('reviewCount').textContent = reviewCount;
    document.getElementById('todayCount').textContent = todayCount;
}

// ====== Display Registrations ======
function displayRegistrations() {
    const tbody = document.getElementById('registrationsTableBody');
    const resultsCount = document.getElementById('resultsCount');

    // Calculate pagination
    const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageRegistrations = filteredRegistrations.slice(startIndex, endIndex);

    // Update results count
    resultsCount.textContent = `${filteredRegistrations.length} نتيجة`;

    // Clear table
    tbody.innerHTML = '';

    if (pageRegistrations.length === 0) {
        showEmptyState();
        return;
    }

    // Show table
    document.getElementById('tableContainer').style.display = 'block';
    document.getElementById('emptyState').style.display = 'none';

    // Populate table
    pageRegistrations.forEach(registration => {
        const row = createRegistrationRow(registration);
        tbody.appendChild(row);
    });

    // Update pagination
    renderPagination(totalPages);
}

// ====== Create Registration Row ======
function createRegistrationRow(registration) {
    const tr = document.createElement('tr');

    // Full Name
    const nameTd = document.createElement('td');
    nameTd.innerHTML = `
        <div style="font-weight: 600;">${registration.studentInfo.fullName}</div>
        <div style="font-size: 0.875rem; color: #6c757d;">${registration.studentInfo.nationality}</div>
    `;
    tr.appendChild(nameTd);

    // Study Type
    const studyTypeTd = document.createElement('td');
    const studyType = registration.metadata?.studyType || 'غير محدد';
    studyTypeTd.innerHTML = `<strong>${studyType}</strong>`;
    tr.appendChild(studyTypeTd);

    // Field/Duration
    const fieldTd = document.createElement('td');
    let fieldValue = '';
    if (studyType === 'معهد لغة') {
        fieldValue = registration.program?.duration || 'غير محدد';
    } else if (studyType === 'جامعة') {
        fieldValue = registration.desiredField || 'غير محدد';
    }
    fieldTd.textContent = fieldValue;
    tr.appendChild(fieldTd);

    // Phone & WhatsApp
    const phoneTd = document.createElement('td');
    phoneTd.innerHTML = `
        <div style="font-size: 0.875rem;">${registration.studentInfo.phone}</div>
        ${registration.studentInfo.whatsapp ? `
            <div style="font-size: 0.75rem; color: #25d366;">
                <i class="fab fa-whatsapp"></i> ${registration.studentInfo.whatsapp}
            </div>
        ` : ''}
    `;
    tr.appendChild(phoneTd);

    // Status
    const statusTd = document.createElement('td');
    statusTd.innerHTML = `<span class="badge ${getStatusBadgeClass(registration.status)}">${registration.status}</span>`;
    tr.appendChild(statusTd);

    // Date
    const dateTd = document.createElement('td');
    const date = new Date(registration.createdAt);
    dateTd.innerHTML = `
        <div style="font-size: 0.875rem;">${date.toLocaleDateString('ar-SA')}</div>
        <div style="font-size: 0.75rem; color: #6c757d;">${date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    tr.appendChild(dateTd);

    // Actions
    const actionsTd = document.createElement('td');
    actionsTd.innerHTML = `
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-whatsapp btn-sm" onclick="contactViaWhatsApp('${registration._id}')" title="تواصل عبر واتساب">
                <i class="fab fa-whatsapp"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="viewDetails('${registration._id}')" title="عرض التفاصيل">
                <i class="fas fa-eye"></i>
            </button>
            <select
                onchange="updateStatus('${registration._id}', this.value)"
                style="padding: 0.375rem 0.5rem; border: 1px solid #dee2e6; border-radius: 0.5rem; font-size: 0.875rem; cursor: pointer;"
            >
                <option value="">تغيير الحالة</option>
                <option value="جديد" ${registration.status === 'جديد' ? 'selected' : ''}>جديد</option>
                <option value="قيد المراجعة" ${registration.status === 'قيد المراجعة' ? 'selected' : ''}>قيد المراجعة</option>
                <option value="تم القبول" ${registration.status === 'تم القبول' ? 'selected' : ''}>تم القبول</option>
                <option value="تم الرفض" ${registration.status === 'تم الرفض' ? 'selected' : ''}>تم الرفض</option>
                <option value="مكتمل" ${registration.status === 'مكتمل' ? 'selected' : ''}>مكتمل</option>
                <option value="ملغي" ${registration.status === 'ملغي' ? 'selected' : ''}>ملغي</option>
            </select>
        </div>
    `;
    tr.appendChild(actionsTd);

    return tr;
}

// ====== Get Status Badge Class ======
function getStatusBadgeClass(status) {
    const statusMap = {
        'جديد': 'badge-new',
        'قيد المراجعة': 'badge-pending',
        'تم القبول': 'badge-approved',
        'تم الرفض': 'badge-rejected',
        'مكتمل': 'badge-completed',
        'ملغي': 'badge-rejected'
    };
    return statusMap[status] || 'badge-new';
}

// ====== Contact Via WhatsApp ======
async function contactViaWhatsApp(registrationId) {
    const registration = allRegistrations.find(r => r._id === registrationId);
    if (!registration) return;

    const whatsappNumber = registration.studentInfo.whatsapp || registration.studentInfo.phone;
    const studentName = registration.studentInfo.fullName;
    const studyType = registration.metadata?.studyType || 'الدراسة';

    // Clean WhatsApp number (remove spaces, dashes, etc.)
    const cleanNumber = whatsappNumber.replace(/[\s\-\(\)]/g, '');

    // Create personalized message
    let message = `السلام عليكم ${studentName}،\n\n`;
    message += `نشكركم على تقديم طلب التسجيل للدراسة في ماليزيا.\n\n`;

    if (studyType === 'معهد لغة') {
        message += `بخصوص طلبكم للالتحاق بمعهد اللغة الإنجليزية، `;
    } else if (studyType === 'جامعة') {
        const field = registration.desiredField || '';
        message += `بخصوص طلبكم للالتحاق بالجامعة لدراسة ${field}، `;
    }

    message += `نود التواصل معكم لاستكمال إجراءات القبول.\n\n`;
    message += `مع تحيات فريق أفاق للدراسة في ماليزيا`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
    const whatsappURL = isMobile
        ? `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`
        : `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
}

// ====== View Details ======
function viewDetails(registrationId) {
    const registration = allRegistrations.find(r => r._id === registrationId);
    if (!registration) return;

    const modalBody = document.getElementById('modalBody');
    const studyType = registration.metadata?.studyType || 'غير محدد';

    let detailsHTML = `
        <!-- Personal Information -->
        <div class="detail-section">
            <h4><i class="fas fa-user"></i> المعلومات الشخصية</h4>
            <div class="detail-row">
                <div class="detail-label">الاسم الكامل:</div>
                <div class="detail-value">${registration.studentInfo.fullName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">البريد الإلكتروني:</div>
                <div class="detail-value">${registration.studentInfo.email || 'غير محدد'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">رقم الهاتف:</div>
                <div class="detail-value">${registration.studentInfo.phone}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">رقم الواتساب:</div>
                <div class="detail-value">
                    <span style="color: #25d366;">
                        <i class="fab fa-whatsapp"></i> ${registration.studentInfo.whatsapp}
                    </span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">الجنسية:</div>
                <div class="detail-value">${registration.studentInfo.nationality}</div>
            </div>
            ${registration.studentInfo.dateOfBirth ? `
                <div class="detail-row">
                    <div class="detail-label">تاريخ الميلاد:</div>
                    <div class="detail-value">${new Date(registration.studentInfo.dateOfBirth).toLocaleDateString('ar-SA')}</div>
                </div>
            ` : ''}
            ${registration.studentInfo.gender ? `
                <div class="detail-row">
                    <div class="detail-label">الجنس:</div>
                    <div class="detail-value">${registration.studentInfo.gender}</div>
                </div>
            ` : ''}
        </div>

        <!-- Academic Information -->
        <div class="detail-section">
            <h4><i class="fas fa-graduation-cap"></i> التفاصيل الأكاديمية</h4>
            <div class="detail-row">
                <div class="detail-label">نوع الدراسة:</div>
                <div class="detail-value"><strong>${studyType}</strong></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">آخر شهادة:</div>
                <div class="detail-value">${registration.educationLevel || 'غير محدد'}</div>
            </div>
    `;

    if (studyType === 'معهد لغة') {
        detailsHTML += `
            <div class="detail-row">
                <div class="detail-label">المدة المطلوبة:</div>
                <div class="detail-value">${registration.program?.duration || 'غير محدد'}</div>
            </div>
        `;
    } else if (studyType === 'جامعة') {
        detailsHTML += `
            <div class="detail-row">
                <div class="detail-label">التخصص المطلوب:</div>
                <div class="detail-value">${registration.desiredField || 'غير محدد'}</div>
            </div>
            ${registration.metadata?.gpa ? `
                <div class="detail-row">
                    <div class="detail-label">المعدل (GPA):</div>
                    <div class="detail-value">${registration.metadata.gpa}</div>
                </div>
            ` : ''}
            ${registration.metadata?.preferredUniversity ? `
                <div class="detail-row">
                    <div class="detail-label">الجامعة المفضلة:</div>
                    <div class="detail-value">${registration.metadata.preferredUniversity}</div>
                </div>
            ` : ''}
        `;
    }

    detailsHTML += `
            ${registration.expectedStartDate ? `
                <div class="detail-row">
                    <div class="detail-label">تاريخ البدء المتوقع:</div>
                    <div class="detail-value">${registration.expectedStartDate}</div>
                </div>
            ` : ''}
            ${registration.notes ? `
                <div class="detail-row">
                    <div class="detail-label">ملاحظات إضافية:</div>
                    <div class="detail-value">${registration.notes}</div>
                </div>
            ` : ''}
        </div>

        <!-- Status & Metadata -->
        <div class="detail-section">
            <h4><i class="fas fa-info-circle"></i> معلومات الطلب</h4>
            <div class="detail-row">
                <div class="detail-label">الحالة:</div>
                <div class="detail-value">
                    <span class="badge ${getStatusBadgeClass(registration.status)}">${registration.status}</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">تاريخ التقديم:</div>
                <div class="detail-value">${new Date(registration.createdAt).toLocaleString('ar-SA')}</div>
            </div>
            ${registration.metadata?.ipAddress ? `
                <div class="detail-row">
                    <div class="detail-label">IP Address:</div>
                    <div class="detail-value" style="font-family: monospace;">${registration.metadata.ipAddress}</div>
                </div>
            ` : ''}
            ${registration.metadata?.source ? `
                <div class="detail-row">
                    <div class="detail-label">المصدر:</div>
                    <div class="detail-value">${registration.metadata.source}</div>
                </div>
            ` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <button class="btn btn-whatsapp" onclick="contactViaWhatsApp('${registration._id}'); closeModal();">
                <i class="fab fa-whatsapp"></i>
                تواصل عبر واتساب
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                <i class="fas fa-times"></i>
                إغلاق
            </button>
        </div>
    `;

    modalBody.innerHTML = detailsHTML;
    document.getElementById('detailsModal').style.display = 'flex';
}

// ====== Close Modal ======
function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

// ====== Update Status ======
async function updateStatus(registrationId, newStatus) {
    if (!newStatus || newStatus === '') return;

    try {
        const response = await fetch(`${API_BASE_URL}/registrations/${registrationId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Update local data
            const registration = allRegistrations.find(r => r._id === registrationId);
            if (registration) {
                registration.status = newStatus;
            }

            // Refresh display
            updateStats();
            displayRegistrations();

            // Show success message
            showToast('تم تحديث الحالة بنجاح', 'success');
        } else {
            throw new Error(result.message || 'فشل تحديث الحالة');
        }

    } catch (error) {
        console.error('Update status error:', error);
        alert('حدث خطأ أثناء تحديث الحالة: ' + error.message);
        // Reload to reset
        loadRegistrations();
    }
}

// ====== Apply Filters ======
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const studyTypeFilter = document.getElementById('studyTypeFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    filteredRegistrations = allRegistrations.filter(registration => {
        // Status filter
        if (statusFilter && registration.status !== statusFilter) {
            return false;
        }

        // Study type filter
        if (studyTypeFilter && registration.metadata?.studyType !== studyTypeFilter) {
            return false;
        }

        // Search filter
        if (searchInput) {
            const searchableText = `
                ${registration.studentInfo.fullName}
                ${registration.studentInfo.phone}
                ${registration.studentInfo.whatsapp || ''}
                ${registration.studentInfo.email || ''}
                ${registration.studentInfo.nationality}
            `.toLowerCase();

            if (!searchableText.includes(searchInput)) {
                return false;
            }
        }

        return true;
    });

    // Reset to first page
    currentPage = 1;

    // Display filtered results
    displayRegistrations();
}

// ====== Reset Filters ======
function resetFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('studyTypeFilter').value = '';
    document.getElementById('searchInput').value = '';

    filteredRegistrations = [...allRegistrations];
    currentPage = 1;

    displayRegistrations();
}

// ====== Pagination ======
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '«';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => goToPage(currentPage - 1);
    pagination.appendChild(prevBtn);

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.onclick = () => goToPage(i);
        pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '»';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => goToPage(currentPage + 1);
    pagination.appendChild(nextBtn);
}

function goToPage(page) {
    currentPage = page;
    displayRegistrations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== UI Helpers ======
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('tableContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
}

function showEmptyState() {
    document.getElementById('tableContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
}

function showToast(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '10000';
    toast.style.minWidth = '300px';
    toast.innerHTML = `<span>${message}</span>`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ====== Sidebar Toggle (Mobile) ======
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ====== Logout ======
function logout(event) {
    event.preventDefault();

    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    }
}

// ====== Expose to Global ======
window.contactViaWhatsApp = contactViaWhatsApp;
window.viewDetails = viewDetails;
window.closeModal = closeModal;
window.updateStatus = updateStatus;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.toggleSidebar = toggleSidebar;
window.logout = logout;
