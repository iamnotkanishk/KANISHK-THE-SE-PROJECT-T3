const authTokenKey = 'stagepassAuthToken';

function getMessageContainer(id) {
    return document.getElementById(id);
}

function showMessage(message, type = 'error') {
    const errorEl = getMessageContainer('errorMessage');
    const successEl = getMessageContainer('successMessage');

    if (errorEl) {
        errorEl.textContent = type === 'error' ? message : '';
        errorEl.style.display = type === 'error' && message ? 'block' : 'none';
    }

    if (successEl) {
        successEl.textContent = type === 'success' ? message : '';
        successEl.style.display = type === 'success' && message ? 'block' : 'none';
    }
}

function clearMessages() {
    showMessage('', 'error');
    showMessage('', 'success');
}

function validateLoginFields({ username, password }) {
    if (!username || !password) {
        return 'Please enter both username and password.';
    }
    return null;
}

function validateSignupFields({ username, password, confirmPassword }) {
    if (!username || !password || !confirmPassword) {
        return 'Please complete every field.';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match.';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters.';
    }
    return null;
}

async function postJson(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const payload = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, payload };
}

async function handleLogin(event) {
    event.preventDefault();
    clearMessages();

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;
    const error = validateLoginFields({ username, password });
    if (error) {
        showMessage(error, 'error');
        return;
    }

    const { ok, payload } = await postJson('/login', { username, password });
    if (!ok) {
        showMessage(payload.message || 'Login failed. Please try again.', 'error');
        return;
    }

    if (payload.token) {
        localStorage.setItem(authTokenKey, payload.token);
    }

    window.location.href = 'index.html';
}

async function handleSignup(event) {
    event.preventDefault();
    clearMessages();

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const error = validateSignupFields({ username, password, confirmPassword });
    if (error) {
        showMessage(error, 'error');
        return;
    }

    const { ok, payload } = await postJson('/signup', { username, password });
    if (!ok) {
        showMessage(payload.message || 'Sign up failed. Please try again.', 'error');
        return;
    }

    showMessage('Account created. Redirecting to login...', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1200);
}

function attachFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

window.addEventListener('DOMContentLoaded', attachFormHandlers);
