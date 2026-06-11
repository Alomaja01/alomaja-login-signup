/**
 * Registration Form Validation Script
 * Handles client-side validation for new user registration
 */

// ===================================
// DOM ELEMENTS
// ===================================
const registrationForm = document.getElementById('registrationForm');
const fullNameField = document.getElementById('fullName');
const emailField = document.getElementById('email');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const togglePasswordBtn = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const messageContainer = document.getElementById('messageContainer');
const loadingSpinner = document.getElementById('loadingSpinner');

// ===================================
// VALIDATION RULES
// ===================================
const validationRules = {
    fullName: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s'-]+$/,
        messages: {
            required: 'Full name is required',
            minLength: 'Full name must be at least 2 characters',
            maxLength: 'Full name cannot exceed 100 characters',
            pattern: 'Full name can only contain letters, spaces, hyphens, and apostrophes'
        }
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: {
            required: 'Email address is required',
            pattern: 'Please enter a valid email address'
        }
    },
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
        minLength: 8,
        maxLength: 100,
        messages: {
            required: 'Password is required',
            minLength: 'Password must be at least 8 characters',
            pattern: 'Password must contain uppercase, lowercase, number, and special character'
        }
    },
    confirmPassword: {
        messages: {
            required: 'Please confirm your password',
            match: 'Passwords do not match'
        }
    }
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Form submission
    registrationForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    fullNameField.addEventListener('blur', () => validateField('fullName'));
    fullNameField.addEventListener('input', () => validateField('fullName'));
    
    emailField.addEventListener('blur', () => validateField('email'));
    emailField.addEventListener('input', () => validateField('email'));
    
    usernameField.addEventListener('blur', () => validateField('username'));
    usernameField.addEventListener('input', () => validateField('username'));
    
    passwordField.addEventListener('blur', () => validateField('password'));
    passwordField.addEventListener('input', () => {
        validateField('password');
        checkPasswordRequirements();
    });
    
    confirmPasswordField.addEventListener('blur', () => validateField('confirmPassword'));
    confirmPasswordField.addEventListener('input', () => validateField('confirmPassword'));
    
    // Password toggle
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Reset button
    resetBtn.addEventListener('click', handleReset);
    
    // Terms checkbox
    termsCheckbox.addEventListener('change', () => {
        const errorEl = document.getElementById('termsError');
        if (termsCheckbox.checked) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
    });
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
        case 'fullName':
            return validateFullName(value, field, errorElement, rules);
        case 'email':
            return validateEmail(value, field, errorElement, rules);
        case 'username':
            return validateUsername(value, field, errorElement, rules);
        case 'password':
            return validatePassword(value, field, errorElement, rules);
        case 'confirmPassword':
            return validateConfirmPassword(value, field, errorElement, rules);
        default:
            return true;
    }
}

/**
 * Validate full name
 */
function validateFullName(value, field, errorElement, rules) {
    if (value.length < rules.minLength) {
        showError('fullName', rules.messages.minLength);
        return false;
    }
    
    if (value.length > rules.maxLength) {
        showError('fullName', rules.messages.maxLength);
        return false;
    }
    
    if (!rules.pattern.test(value)) {
        showError('fullName', rules.messages.pattern);
        return false;
    }
    
    clearError('fullName');
    return true;
}

/**
 * Validate email
 */
function validateEmail(value, field, errorElement, rules) {
    if (!rules.pattern.test(value)) {
        showError('email', rules.messages.pattern);
        return false;
    }
    
    clearError('email');
    return true;
}

/**
 * Validate username
 */
function validateUsername(value, field, errorElement, rules) {
    if (value.length < rules.minLength) {
        showError('username', rules.messages.minLength);
        return false;
    }
    
    if (value.length > rules.maxLength) {
        showError('username', rules.messages.maxLength);
        return false;
    }
    
    if (!rules.pattern.test(value)) {
        showError('username', rules.messages.pattern);
        return false;
    }
    
    clearError('username');
    return true;
}

/**
 * Validate password
 */
function validatePassword(value, field, errorElement, rules) {
    if (value.length < rules.minLength) {
        showError('password', rules.messages.minLength);
        return false;
    }
    
    if (!isPasswordStrong(value)) {
        showError('password', rules.messages.pattern);
        return false;
    }
    
    clearError('password');
    return true;
}

/**
 * Validate confirm password
 */
function validateConfirmPassword(value, field, errorElement, rules) {
    if (!value) {
        showError('confirmPassword', rules.messages.required);
        return false;
    }
    
    if (value !== passwordField.value) {
        showError('confirmPassword', rules.messages.match);
        return false;
    }
    
    clearError('confirmPassword');
    return true;
}

/**
 * Check if password is strong
 * Must have: uppercase, lowercase, number, special character
 */
function isPasswordStrong(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

/**
 * Check password requirements and update UI
 */
function checkPasswordRequirements() {
    const password = passwordField.value;
    
    const requirements = {
        'req-length': password.length >= 8,
        'req-uppercase': /[A-Z]/.test(password),
        'req-lowercase': /[a-z]/.test(password),
        'req-number': /\d/.test(password),
        'req-special': /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    Object.keys(requirements).forEach(reqId => {
        const element = document.getElementById(reqId);
        const icon = element.querySelector('.requirement-icon');
        
        if (requirements[reqId]) {
            element.classList.add('met');
            icon.textContent = '✓';
        } else {
            element.classList.remove('met');
            icon.textContent = '✗';
        }
    });
}

/**
 * Validate all fields
 */
function validateAllFields() {
    const fullNameValid = validateField('fullName');
    const emailValid = validateField('email');
    const usernameValid = validateField('username');
    const passwordValid = validateField('password');
    const confirmPasswordValid = validateField('confirmPassword');
    
    let termsValid = true;
    const termsError = document.getElementById('termsError');
    if (!termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the terms and conditions';
        termsError.classList.add('show');
        termsValid = false;
    } else {
        termsError.textContent = '';
        termsError.classList.remove('show');
    }
    
    return fullNameValid && emailValid && usernameValid && passwordValid && confirmPasswordValid && termsValid;
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
    const formData = new FormData(registrationForm);
    const fullName = formData.get('fullName').trim();
    const email = formData.get('email').trim();
    const username = formData.get('username').trim();
    const password = formData.get('password');
    
    try {
        // Show loading spinner
        showLoadingSpinner(true);
        
        // Prepare request
        const payload = {
            fullName: fullName,
            email: email,
            username: username,
            password: password,
            timestamp: new Date().getTime()
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Send request to PHP backend
        const response = await fetch('process_register.php', {
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
            
            // Clear form
            registrationForm.reset();
            
            // Redirect to login after brief delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            displayMessage(result.message, 'error');
            
            // Clear sensitive fields
            passwordField.value = '';
            confirmPasswordField.value = '';
            checkPasswordRequirements();
            
            // Focus on first error field
            if (result.field) {
                document.getElementById(result.field).focus();
            }
        }
    } catch (error) {
        showLoadingSpinner(false);
        console.error('Registration error:', error);
        displayMessage('An error occurred. Please try again later.', 'error');
    }
}

/**
 * Handle form reset
 */
function handleReset(event) {
    event.preventDefault();
    
    // Clear form
    registrationForm.reset();
    
    // Clear all errors
    clearError('fullName');
    clearError('email');
    clearError('username');
    clearError('password');
    clearError('confirmPassword');
    document.getElementById('termsError').textContent = '';
    document.getElementById('termsError').classList.remove('show');
    
    // Clear message container
    messageContainer.innerHTML = '';
    
    // Reset password requirements
    checkPasswordRequirements();
    
    // Focus on first field
    fullNameField.focus();
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
    
    // Auto-remove error/info messages after 5 seconds
    if (type !== 'success') {
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

// ===================================
// ACCESSIBILITY
// ===================================

/**
 * Enhanced keyboard navigation
 */
document.addEventListener('keydown', (event) => {
    // Enter key to submit
    if (event.key === 'Enter' && registrationForm.contains(document.activeElement)) {
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
