/**
 * Registration Form Validation & Interaction Script
 * Handles client-side validation, password strength, and form interactions
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
const agreeTermsCheckbox = document.getElementById('agreeTerms');
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
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        messages: {
            required: 'Password is required',
            minLength: 'Password must be at least 8 characters',
            maxLength: 'Password cannot exceed 100 characters',
            pattern: 'Password must contain uppercase, lowercase, number, and special character'
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
        updatePasswordStrength();
        validatePasswordMatch();
    });
    
    confirmPasswordField.addEventListener('blur', validatePasswordMatch);
    confirmPasswordField.addEventListener('input', validatePasswordMatch);
    
    // Password toggle visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Reset button
    resetBtn.addEventListener('click', handleReset);
    
    // Terms checkbox
    agreeTermsCheckbox.addEventListener('change', () => validateField('terms'));
}

// ===================================
// VALIDATION FUNCTIONS
// ===================================

/**
 * Validate a single field
 */
function validateField(fieldName) {
    const field = document.getElementById(fieldName === 'terms' ? 'agreeTerms' : fieldName);
    const errorElement = document.getElementById(`${fieldName}Error`);
    let value = field.type === 'checkbox' ? field.checked : field.value.trim();
    const rules = validationRules[fieldName];
    
    // Clear previous error
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    
    // Check if field is empty
    if (!value) {
        const errorMsg = rules ? rules.messages.required : 'This field is required';
        showError(fieldName, errorMsg);
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
        case 'terms':
            return validateTerms(value);
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
    
    if (value.length > rules.maxLength) {
        showError('password', rules.messages.maxLength);
        return false;
    }
    
    if (!rules.pattern.test(value)) {
        showError('password', rules.messages.pattern);
        return false;
    }
    
    clearError('password');
    return true;
}

/**
 * Validate password match
 */
function validatePasswordMatch() {
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (!confirmPassword) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        return true;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        return false;
    }
    
    clearError('confirmPassword');
    return true;
}

/**
 * Validate terms acceptance
 */
function validateTerms(value) {
    if (!value) {
        showError('terms', 'You must agree to the terms and conditions');
        return false;
    }
    clearError('terms');
    return true;
}

/**
 * Validate all fields
 */
function validateAllFields() {
    const fullNameValid = validateField('fullName');
    const emailValid = validateField('email');
    const usernameValid = validateField('username');
    const passwordValid = validateField('password');
    const confirmPasswordValid = validatePasswordMatch();
    const termsValid = validateField('terms');
    
    return fullNameValid && emailValid && usernameValid && 
           passwordValid && confirmPasswordValid && termsValid;
}

/**
 * Show error message for a field
 */
function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const field = document.getElementById(fieldName === 'terms' ? 'agreeTerms' : fieldName);
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    if (field && field.type !== 'checkbox') {
        field.setAttribute('aria-invalid', 'true');
    }
}

/**
 * Clear error message for a field
 */
function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const field = document.getElementById(fieldName === 'terms' ? 'agreeTerms' : fieldName);
    
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    
    if (field && field.type !== 'checkbox') {
        field.setAttribute('aria-invalid', 'false');
    }
}

// ===================================
// PASSWORD STRENGTH
// ===================================

/**
 * Update password strength indicator
 */
function updatePasswordStrength() {
    const password = passwordField.value;
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('strengthText');
    
    // Clear previous strength
    strengthContainer.innerHTML = '';
    
    // Calculate strength
    let strength = 0;
    let requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&]/.test(password)
    };
    
    // Update requirement indicators
    updateRequirement('length', requirements.length);
    updateRequirement('uppercase', requirements.uppercase);
    updateRequirement('lowercase', requirements.lowercase);
    updateRequirement('number', requirements.number);
    updateRequirement('special', requirements.special);
    
    // Calculate strength level
    strength = Object.values(requirements).filter(Boolean).length;
    
    // Show strength bars
    for (let i = 0; i < 4; i++) {
        const bar = document.createElement('div');
        bar.className = 'strength-bar';
        
        if (i < strength) {
            if (strength === 1) bar.classList.add('weak');
            else if (strength === 2) bar.classList.add('fair');
            else if (strength === 3) bar.classList.add('good');
            else bar.classList.add('strong');
        }
        
        strengthContainer.appendChild(bar);
    }
    
    // Show strength text
    let strengthLabel = '';
    if (password.length === 0) {
        strengthLabel = '';
    } else if (strength === 1) {
        strengthLabel = 'Weak';
    } else if (strength === 2) {
        strengthLabel = 'Fair';
    } else if (strength === 3) {
        strengthLabel = 'Good';
    } else {
        strengthLabel = 'Strong';
    }
    
    strengthText.textContent = strengthLabel;
}

/**
 * Update requirement indicator
 */
function updateRequirement(type, met) {
    const req = document.getElementById(`req-${type}`);
    const icon = req.querySelector('.requirement-icon');
    
    if (met) {
        req.classList.add('met');
        icon.textContent = '✓';
    } else {
        req.classList.remove('met');
        icon.textContent = '○';
    }
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
    const data = {
        fullName: formData.get('fullName').trim(),
        email: formData.get('email').trim().toLowerCase(),
        username: formData.get('username').trim(),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        agreeTerms: formData.get('agreeTerms') ? '1' : '0',
        timestamp: new Date().getTime()
    };
    
    // Additional validation
    if (data.password !== data.confirmPassword) {
        displayMessage('Passwords do not match', 'error');
        return;
    }
    
    if (data.agreeTerms !== '1') {
        displayMessage('You must agree to the terms and conditions', 'error');
        return;
    }
    
    try {
        // Show loading spinner
        showLoadingSpinner(true);
        
        // Simulate network delay (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Send request to PHP backend
        const response = await fetch('process_register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        });
        
        const result = await response.json();
        
        // Hide loading spinner
        showLoadingSpinner(false);
        
        if (result.success) {
            displayMessage(result.message, 'success');
            
            // Clear form
            registrationForm.reset();
            updatePasswordStrength();
            
            // Redirect to login after delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            displayMessage(result.message, 'error');
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
    clearError('terms');
    
    // Clear message container
    messageContainer.innerHTML = '';
    
    // Clear password strength
    document.getElementById('passwordStrength').innerHTML = '';
    document.getElementById('strengthText').textContent = '';
    
    // Reset requirements
    ['length', 'uppercase', 'lowercase', 'number', 'special'].forEach(type => {
        const req = document.getElementById(`req-${type}`);
        req.classList.remove('met');
        req.querySelector('.requirement-icon').textContent = '○';
    });
    
    // Focus on full name field
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
    
    // Auto-remove messages after delay
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

/**
 * Show/hide loading spinner
 */
function showLoadingSpinner(show) {
    if (show) {
        document.getElementById('loadingSpinner').classList.add('show');
        submitBtn.disabled = true;
    } else {
        document.getElementById('loadingSpinner').classList.remove('show');
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
// KEYBOARD NAVIGATION
// ===================================

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
