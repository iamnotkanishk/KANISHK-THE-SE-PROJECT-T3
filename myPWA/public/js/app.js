const authTokenKey = 'stagepassJwtToken';
const authUserKey = 'stagepassUser';

function getMessageContainer(id) { // Helper to get message container elements
    return document.getElementById(id); 
}

function getStoredToken() { // Retrieve stored JWT token from localStorage
    return localStorage.getItem(authTokenKey);
}

function getStoredUser() { // Retrieve stored user information from localStorage
    const raw = localStorage.getItem(authUserKey);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function setAuth(token, user) { // Store JWT token and user information in localStorage
    if (token) {
        localStorage.setItem(authTokenKey, token);
    }
    if (user) {
        localStorage.setItem(authUserKey, JSON.stringify(user));
    }
}

function clearAuth() { // Clear authentication data from localStorage
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(authUserKey);
}

function authHeaders() { // Helper to get authorization headers for authenticated requests
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function showMessage(message, type = 'error') { // type can be 'error' or 'success'
    const errorEl = getMessageContainer('errorMessage');
    const successEl = getMessageContainer('successMessage');

    if (errorEl) { // Show error message if type is 'error'
        errorEl.textContent = type === 'error' ? message : '';
        errorEl.style.display = type === 'error' && message ? 'block' : 'none';
    }

    if (successEl) { // Show success message if type is 'success'
        successEl.textContent = type === 'success' ? message : '';
        successEl.style.display = type === 'success' && message ? 'block' : 'none';
    }
}

function clearMessages() {
    showMessage('', 'error');
    showMessage('', 'success');
}

function validateLoginFields({ username, password }) { // Validate login form fields
    if (!username || !password) {
        return 'Please enter both username and password.';
    }
    return null;
}

function validateSignupFields({ username, password, confirmPassword }) { // Validate signup form fields
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

async function postJson(url, data) { // Helper function to send POST requests with JSON body
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const payload = await response.json().catch(() => ({})); // Attempt to parse JSON response, fallback to empty object on failure
    return { ok: response.ok, status: response.status, payload };
}

async function handleLogin(event) { // Handle login form submission
    event.preventDefault();
    clearMessages();

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;
    const error = validateLoginFields({ username, password }); // Validate login fields
    if (error) {
        showMessage(error, 'error');
        return;
    }

    const { ok, payload } = await postJson('/login', { username, password }); // Send login request to server
    if (!ok) {
        showMessage(payload.message || 'Login failed. Please try again.', 'error');
        return;
    }

    if (payload.token && payload.user) { // Store token and user info on successful login
        setAuth(payload.token, payload.user);
    }

    if (payload.user?.role === 'admin') { // Redirect admin users to admin page
        window.location.href = 'admin.html';
        return;
    }

    window.location.href = 'index.html';
}

async function handleSignup(event) { // Handle signup form submission
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

    const { ok, payload } = await postJson('/signup', { username, password }); // Send signup request to server
    if (!ok) {
        showMessage(payload.message || 'Sign up failed. Please try again.', 'error');
        return;
    }

    showMessage('Account created. Redirecting to login...', 'success'); // Show success message on successful signup
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1200);
}

async function loadEvents() { // Load events from server and display them
    try {
        const response = await fetch('/events');
        const data = await response.json();
        const events = data.events || [];
        
        const container = document.getElementById('eventsContainer'); // Get the container element for displaying events
        if (!container) return; 
        
        if (events.length === 0) {
            container.innerHTML = '<div class="no-events">No events available</div>';
            return;
        }
        
        // Render event cards with basic info and a button to view details
        container.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="event-info">
                    <h3>${event.title || 'Untitled Event'}</h3>
                    <p class="event-location"><strong>Location:</strong> ${event.location || 'TBA'}</p> 
                    <p class="event-date"><strong>Date:</strong> ${event.date || 'TBA'}</p>
                </div>
                <button class="find-tickets-btn" onclick="viewEvent(${event.id})">Find Tickets</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load events:', error); // Log error to console for debugging
        const container = document.getElementById('eventsContainer');
        if (container) {
            container.innerHTML = '<div class="error">Failed to load events</div>';
        }
    }
}

function viewEvent(eventId) { // Navigate to event detail page (to be implemented)
    window.location.href = `event-detail.html?id=${eventId}`;
}

function attachFormHandlers() {
    const loginForm = document.getElementById('loginForm'); // Attach event listener to login form if it exists
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const signupForm = document.getElementById('signupForm'); // Attach event listener to signup form if it exists
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

window.addEventListener('DOMContentLoaded', attachFormHandlers);
