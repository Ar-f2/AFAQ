/**
 * AFAQ CMS - Registration Form JavaScript
 * نموذج التسجيل الذكي
 */

// ====== Configuration ======
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1';

let currentStep = 1;
const totalSteps = 3;
let formData = {};

// ====== Initialize Form ======
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    console.log('✅ Registration form initialized');
});

function initializeForm() {
    // Study Type Change Handler
    const studyTypeInputs = document.querySelectorAll('input[name="studyType"]');
    studyTypeInputs.forEach(input => {
        input.addEventListener('change', handleStudyTypeChange);
    });

    // Copy phone to WhatsApp if needed
    const phoneInput = document.getElementById('phone');
    const whatsappInput = document.getElementById('whatsapp');

    phoneInput.addEventListener('blur', function() {
        if (!whatsappInput.value) {
            whatsappInput.value = phoneInput.value;
        }
    });

    // Form Submit Handler
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', handleFormSubmit);
}

// ====== Study Type Handler ======
function handleStudyTypeChange(e) {
    const studyType = e.target.value;
    const instituteDurationGroup = document.getElementById('instituteDurationGroup');
    const universityFields = document.getElementById('universityFields');
    const instituteDuration = document.getElementById('instituteDuration');
    const desiredField = document.getElementById('desiredField');
    const gpa = document.getElementById('gpa');

    if (studyType === 'معهد لغة') {
        // Show institute fields
        instituteDurationGroup.style.display = 'block';
        instituteDuration.required = true;

        // Hide university fields
        universityFields.style.display = 'none';
        desiredField.required = false;
        gpa.required = false;

    } else if (studyType === 'جامعة') {
        // Hide institute fields
        instituteDurationGroup.style.display = 'none';
        instituteDuration.required = false;

        // Show university fields
        universityFields.style.display = 'grid';
        universityFields.style.gridColumn = '1 / -1';
        universityFields.style.display = 'contents'; // Makes children grid items
        desiredField.required = true;
        gpa.required = true;
    }
}

// ====== Step Navigation ======
function nextStep(step) {
    if (!validateStep(currentStep)) {
        return;
    }

    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');

    // Show next step
    currentStep = step;
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');

    // If review step, populate review section
    if (currentStep === 3) {
        populateReview();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');

    // Show previous step
    currentStep = step;
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== Validation ======
function validateStep(step) {
    const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredFields = stepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        // Clear previous errors
        field.classList.remove('error');
        const errorMsg = field.closest('.form-group').querySelector('.error-message');
        if (errorMsg) errorMsg.style.display = 'none';

        // Skip validation for hidden fields
        const group = field.closest('.form-group');
        if (group && group.style.display === 'none') {
            return;
        }

        // Validate
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = 'هذا الحقل مطلوب';
                errorMsg.style.display = 'block';
            }
        } else {
            // Additional validation
            if (field.type === 'email' && !validateEmail(field.value)) {
                isValid = false;
                field.classList.add('error');
                if (errorMsg) {
                    errorMsg.textContent = 'الرجاء إدخال بريد إلكتروني صحيح';
                    errorMsg.style.display = 'block';
                }
            }

            if (field.type === 'tel' && !validatePhone(field.value)) {
                isValid = false;
                field.classList.add('error');
                if (errorMsg) {
                    errorMsg.textContent = 'الرجاء إدخال رقم هاتف صحيح';
                    errorMsg.style.display = 'block';
                }
            }
        }
    });

    if (!isValid) {
        // Scroll to first error
        const firstError = stepElement.querySelector('.form-control.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return re.test(phone);
}

// ====== Populate Review ======
function populateReview() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    const reviewSection = document.getElementById('reviewSection');

    // Personal Information
    let personalInfo = `
        <div class="review-group">
            <h3><i class="fas fa-user"></i> المعلومات الشخصية</h3>
            <div class="review-item">
                <div class="review-label">الاسم الكامل:</div>
                <div class="review-value">${formData.get('fullName')}</div>
            </div>
            <div class="review-item">
                <div class="review-label">البريد الإلكتروني:</div>
                <div class="review-value">${formData.get('email') || 'غير محدد'}</div>
            </div>
            <div class="review-item">
                <div class="review-label">رقم الهاتف:</div>
                <div class="review-value">${formData.get('phone')}</div>
            </div>
            <div class="review-item">
                <div class="review-label">رقم الواتساب:</div>
                <div class="review-value">${formData.get('whatsapp')}</div>
            </div>
            <div class="review-item">
                <div class="review-label">الجنسية:</div>
                <div class="review-value">${formData.get('nationality')}</div>
            </div>
            <div class="review-item">
                <div class="review-label">تاريخ الميلاد:</div>
                <div class="review-value">${formData.get('dateOfBirth')}</div>
            </div>
            <div class="review-item">
                <div class="review-label">الجنس:</div>
                <div class="review-value">${formData.get('gender')}</div>
            </div>
        </div>
    `;

    // Academic Information
    const studyType = formData.get('studyType');
    let academicInfo = `
        <div class="review-group">
            <h3><i class="fas fa-graduation-cap"></i> التفاصيل الأكاديمية</h3>
            <div class="review-item">
                <div class="review-label">نوع الدراسة:</div>
                <div class="review-value"><strong>${studyType}</strong></div>
            </div>
            <div class="review-item">
                <div class="review-label">آخر شهادة:</div>
                <div class="review-value">${formData.get('educationLevel')}</div>
            </div>
    `;

    if (studyType === 'معهد لغة') {
        academicInfo += `
            <div class="review-item">
                <div class="review-label">المدة المطلوبة:</div>
                <div class="review-value">${formData.get('instituteDuration')}</div>
            </div>
        `;
    } else if (studyType === 'جامعة') {
        academicInfo += `
            <div class="review-item">
                <div class="review-label">التخصص المطلوب:</div>
                <div class="review-value">${formData.get('desiredField')}</div>
            </div>
            <div class="review-item">
                <div class="review-label">المعدل:</div>
                <div class="review-value">${formData.get('gpa')}</div>
            </div>
            ${formData.get('preferredUniversity') ? `
            <div class="review-item">
                <div class="review-label">الجامعة المفضلة:</div>
                <div class="review-value">${formData.get('preferredUniversity')}</div>
            </div>
            ` : ''}
        `;
    }

    academicInfo += `
            <div class="review-item">
                <div class="review-label">تاريخ البدء المتوقع:</div>
                <div class="review-value">${formData.get('expectedStartDate') || 'غير محدد'}</div>
            </div>
            ${formData.get('notes') ? `
            <div class="review-item">
                <div class="review-label">ملاحظات إضافية:</div>
                <div class="review-value">${formData.get('notes')}</div>
            </div>
            ` : ''}
        </div>
    `;

    reviewSection.innerHTML = personalInfo + academicInfo;
}

// ====== Form Submit ======
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateStep(3)) {
        return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.btn-submit');

    // Prepare data
    const data = {
        studentInfo: {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            whatsapp: formData.get('whatsapp'),
            nationality: formData.get('nationality'),
            dateOfBirth: formData.get('dateOfBirth'),
            gender: formData.get('gender')
        },
        studyType: formData.get('studyType'),
        educationLevel: formData.get('educationLevel'),
        expectedStartDate: formData.get('expectedStartDate'),
        notes: formData.get('notes')
    };

    // Add study-type specific fields
    if (formData.get('studyType') === 'معهد لغة') {
        data.instituteDuration = formData.get('instituteDuration');
    } else if (formData.get('studyType') === 'جامعة') {
        data.program = {
            name: formData.get('desiredField'),
            duration: ''
        };
        data.desiredField = formData.get('desiredField');
        data.gpa = formData.get('gpa');
        data.preferredUniversity = formData.get('preferredUniversity');
    }

    // Get user metadata
    data.metadata = {
        ipAddress: '', // Will be filled by backend
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        source: 'website'
    };

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message
            document.querySelector('.registration-form').style.display = 'none';
            document.querySelector('.form-progress').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Optional: Track conversion
            if (window.gtag) {
                gtag('event', 'registration_submit', {
                    'event_category': 'engagement',
                    'event_label': data.studyType
                });
            }
        } else {
            throw new Error(result.message || 'حدث خطأ أثناء إرسال الطلب');
        }

    } catch (error) {
        console.error('Submit error:', error);

        if (window.AFAQ && window.AFAQ.showToast) {
            window.AFAQ.showToast('حدث خطأ: ' + error.message, 'error');
        } else {
            alert('حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.');
        }

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب';
    }
}

// ====== Expose Functions to Global ======
window.nextStep = nextStep;
window.prevStep = prevStep;
