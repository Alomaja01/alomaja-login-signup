/**
 * Login Form Validation & Interaction Script
 * Handles client-side validation, error display, and form interactions
 */

// ===================================
// DOM ELEMENTS
// ===================================
const loginForm = document.getElementById('loginForm');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const togglePasswordBtn = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const messageContainer = document.getElementById('messageContainer');
const loadingSpinner = document.getElementById('loadingSpinner');

// ===================================
// VALIDATION RULES
// ===================================
const validationRules = {
    username: {
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_-]+$/,
        messages: {
            required: 'Username is required',
            minLength: 'Username must be at least 3 characters',
            maxLength: 'Username cannot exceed 30 characters',
            pattern: 'Username can only contain letters, numbers, hyphens, and underscores'
        }
    },
    password: {
        minLength: 6,
        maxLength: 100,
        messages: {
            required: 'Password is required',
            minLength: 'Password must be at least 6 characters'
        }
    }
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    restoreRememberedUsername();
    setupEventListeners();
});

/**
 * Initialize form with data attributes
 */
function initializeForm() {
    // Check for server-side messages in localStorage
    const serverMessage = localStorage.getItem('loginMessage');
    const messageType = localStorage.getItem('messageType');
    
    if (serverMessage) {
        displayMessage(serverMessage, messageType || 'info');
        localStorage.removeItem('loginMessage');
        localStorage.removeItem('messageType');
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    usernameField.addEventListener('blur', () => validateField('username'));
    usernameField.addEventListener('input', () => validateField('username'));
    
    passwordField.addEventListener('blur', () => validateField('password'));
    passwordField.addEventListener('input', () => validateField('password'));
    
    // Password toggle visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Reset button
    resetBtn.addEventListener('click', handleReset);
    
    // Remember me functionality
    rememberMeCheckbox.addEventListener('change', updateRememberedUsername);
}

// ===================================
// VALIDATION FUNCTIONS
// ===================================

/**
 * Validate a single field
 */
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}Error`);
    const value = field.value.trim();
    const rules = validationRules[fieldName];
    
    // Clear previous error
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    
    // Check if field is empty
    if (!value) {
        showError(fieldName, rules.messages.required);
        return false;
    }
    
    // Validate based on field type
    switch (fieldName) {
        case 'username':
            return validateUsername(value, field, errorElement, rules);
        case 'password':
            return validatePassword(value, field, errorElement, rules);
        default:
            return true;
    }
}

/**
 * Validate username field
 */
function validateUsername(value, field, errorElement, rules) {
    // Check minimum length
    if (value.length < rules.minLength) {
        showError('username', rules.messages.minLength);
        return false;
    }
    
    // Check maximum length
    if (value.length > rules.maxLength) {
        showError('username', rules.messages.maxLength);
        return false;
    }
    
    // Check pattern
    if (!rules.pattern.test(value)) {
        showError('username', rules.messages.pattern);
        return false;
    }
    
    clearError('username');
    return true;
}

/**
 * Validate password field
 */
function validatePassword(value, field, errorElement, rules) {
    // Check minimum length
    if (value.length < rules.minLength) {
        showError('password', rules.messages.minLength);
        return false;
    }
    
    // Check maximum length (warn but don't fail)
    if (value.length > rules.maxLength) {
        showError('password', 'Password seems unusually long');
        return true; // Still allow submission
    }
    
    clearError('password');
    return true;
}

/**
 * Validate all fields
 */
function validateAllFields() {
    const usernameValid = validateField('username');
    const passwordValid = validateField('password');
    return usernameValid && passwordValid;
}

/**
 * Show error message for a field
 */
function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const field = document.getElementById(fieldName);
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
    field.setAttribute('aria-invalid', 'true');
}

/**
 * Clear error message for a field
 */
function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const field = document.getElementById(fieldName);
    
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    field.setAttribute('aria-invalid', 'false');
}

// ===================================
// FORM HANDLERS
// ===================================

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Clear previous messages
    messageContainer.innerHTML = '';
    
    // Validate all fields
    if (!validateAllFields()) {
        displayMessage('Please fix the errors above', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(loginForm);
    const username = formData.get('username').trim();
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe') ? '1' : '0';
    
    try {
        // Show loading spinner
        showLoadingSpinner(true);
        
        // Prepare request
        const payload = {
            username: username,
            password: password,
            rememberMe: rememberMe,
            timestamp: new Date().getTime()
        };
        
        // Simulate network delay (remove in production)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Send request to PHP backend
        const response = await fetch('process_login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(payload)
        });
        
        const result = await response.json();
        
        // Hide loading spinner
        showLoadingSpinner(false);
        
        if (result.success) {
            displayMessage(result.message, 'success');
            
            // Save username if remember me is checked
            if (rememberMe === '1') {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            
            // Redirect after brief delay
            setTimeout(() => {
                window.location.href = result.redirect || 'dashboard.html';
            }, 1500);
        } else {
            displayMessage(result.message, 'error');
            
            // Clear sensitive fields
            passwordField.value = '';
            
            // Focus on password field for retry
            passwordField.focus();
        }
    } catch (error) {
        showLoadingSpinner(false);
        console.error('Login error:', error);
        displayMessage('An error occurred. Please try again later.', 'error');
    }
}

/**
 * Handle form reset
 */
function handleReset(event) {
    event.preventDefault();
    
    // Clear form
    loginForm.reset();
    
    // Clear all errors
    clearError('username');
    clearError('password');
    
    // Clear message container
    messageContainer.innerHTML = '';
    
    // Focus on username field
    usernameField.focus();
}

// ===================================
// UI INTERACTIONS
// ===================================

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(event) {
    event.preventDefault();
    
    const isPassword = passwordField.type === 'password';
    passwordField.type = isPassword ? 'text' : 'password';
    
    // Update button aria-label
    const label = isPassword ? 'Hide password' : 'Show password';
    togglePasswordBtn.setAttribute('aria-label', label);
    
    // Add visual feedback
    togglePasswordBtn.classList.add('toggled');
    setTimeout(() => {
        togglePasswordBtn.classList.remove('toggled');
    }, 300);
}

/**
 * Display message to user
 */
function displayMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    
    // Create icon SVG based on type
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M 8 12 L 11 15 L 16 9"/></svg>';
    } else if (type === 'error') {
        iconSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M 8 8 L 16 16 M 16 8 L 8 16"/></svg>';
    } else {
        iconSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M 12 8 L 12 12 M 12 16 L 12.01 16"/></svg>';
    }
    
    messageEl.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    messageContainer.appendChild(messageEl);
    
    // Auto-remove error messages after 5 seconds (success messages stay until navigation)
    if (type === 'error' || type === 'info') {
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

/**
 * Show/hide loading spinner
 */
function showLoadingSpinner(show) {
    if (show) {
        loadingSpinner.classList.add('show');
        submitBtn.disabled = true;
    } else {
        loadingSpinner.classList.remove('show');
        submitBtn.disabled = false;
    }
}

// ===================================
// REMEMBER ME FUNCTIONALITY
// ===================================

/**
 * Restore remembered username from localStorage
 */
function restoreRememberedUsername() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        usernameField.value = rememberedUsername;
        rememberMeCheckbox.checked = true;
        passwordField.focus();
    }
}

/**
 * Update remembered username
 */
function updateRememberedUsername() {
    if (rememberMeCheckbox.checked) {
        const username = usernameField.value.trim();
        if (username) {
            localStorage.setItem('rememberedUsername', username);
        }
    } else {
        localStorage.removeItem('rememberedUsername');
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Escape HTML characters to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Debounce function for repeated calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// ACCESSIBILITY
// ===================================

/**
 * Enhanced keyboard navigation
 */
document.addEventListener('keydown', (event) => {
    // Enter key to submit (when focus is on form)
    if (event.key === 'Enter' && loginForm.contains(document.activeElement)) {
        if (document.activeElement !== resetBtn) {
            event.preventDefault();
            submitBtn.click();
        }
    }
    
    // Escape key to reset form
    if (event.key === 'Escape') {
        resetBtn.click();
    }
});
