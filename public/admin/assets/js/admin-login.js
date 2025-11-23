/**
 * AFAQ CMS - Admin Login Script
 * صفحة تسجيل دخول الإدارة
 */

// ====== Configuration ======
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1';

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
        // Verify token is still valid
        verifyToken(token);
    }

    // Setup form submit handler
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);

    // Load remember me if exists
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }

    console.log('✅ Admin login initialized');
});

// ====== Toggle Password Visibility ======
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// ====== Verify Existing Token ======
async function verifyToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                // Token is valid, redirect to dashboard
                window.location.href = 'registrations.html';
            }
        } else {
            // Token is invalid, clear it
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        }
    } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    }
}

// ====== Handle Login ======
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Hide previous errors
    hideError();

    // Validate
    if (!email || !password) {
        showError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
        return;
    }

    // Show loading
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Save token
            localStorage.setItem('adminToken', result.data.token);
            localStorage.setItem('adminUser', JSON.stringify(result.data.user));

            // Remember me
            if (remember) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Success - redirect to dashboard
            showSuccess('تم تسجيل الدخول بنجاح! جاري التحويل...');

            setTimeout(() => {
                window.location.href = 'registrations.html';
            }, 1000);

        } else {
            // Login failed
            throw new Error(result.message || 'فشل تسجيل الدخول');
        }

    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
    } finally {
        hideLoading();
    }
}

// ====== UI Helpers ======
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    errorText.textContent = message;
    errorDiv.style.display = 'flex';

    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
}

function showSuccess(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    errorDiv.className = 'alert alert-success';
    errorDiv.querySelector('i').className = 'fas fa-check-circle';
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// ====== Expose to Global ======
window.togglePassword = togglePassword;
