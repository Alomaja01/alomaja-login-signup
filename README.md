# SecureLogin - Web-Based Authentication Application

A professional, responsive login authentication system built with HTML5, CSS3, JavaScript, and PHP. Features modern security practices, comprehensive validation, and an intuitive user interface.

---

## 📋 Table of Contents

- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Security Features](#security-features)
- [Demo Credentials](#demo-credentials)
- [Customization](#customization)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Frontend (HTML/CSS/JavaScript)
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Real-time Input Validation** - Client-side validation with helpful error messages
- ✅ **Password Visibility Toggle** - Users can show/hide password with eye icon
- ✅ **Remember Me Functionality** - Persists username using localStorage
- ✅ **Loading Spinner** - Visual feedback during authentication
- ✅ **Accessibility Features** - WCAG compliant with keyboard navigation
- ✅ **Modern UI/UX** - Gradient backgrounds, smooth animations, and focus states
- ✅ **Error Messaging** - Clear, actionable error messages with icons
- ✅ **XSS Protection** - HTML entity escaping to prevent cross-site scripting

### Backend (PHP)
- ✅ **Secure Authentication** - Password verification using bcrypt hashing
- ✅ **Session Management** - Secure session handling with configurable timeouts
- ✅ **Rate Limiting** - Protection against brute-force attacks (max 5 attempts)
- ✅ **IP-Based Lockout** - Automatic account lockout after failed attempts
- ✅ **Input Validation** - Comprehensive server-side input validation
- ✅ **Security Headers** - HSTS, X-Frame-Options, X-XSS-Protection, etc.
- ✅ **CSRF Protection** - Token-based CSRF prevention mechanism
- ✅ **HTTP-Only Cookies** - Prevents JavaScript access to session cookies
- ✅ **Content Security** - JSON response with proper content type headers

### UX/UI Features
- ✅ **Loading States** - Disabled inputs during submission
- ✅ **Success/Error Notifications** - Toast-style messages with auto-dismiss
- ✅ **Form Reset Functionality** - Clear button with full form reset
- ✅ **Keyboard Shortcuts** - Enter to submit, Escape to reset
- ✅ **Light/Dark Mode Support** - Automatic detection and responsive theming
- ✅ **Reduced Motion Support** - Respects user motion preferences
- ✅ **SVG Icons** - Scalable vector graphics for all UI elements

---

## 🛠️ System Requirements

- **Web Server**: Apache, Nginx, or similar (with PHP support)
- **PHP Version**: 7.4 or higher
- **Browsers**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **JavaScript**: Must be enabled
- **HTTPS**: Recommended for production

---

## 📥 Installation

### Step 1: Download Files
Download and extract all files to your web server directory:
```
your-domain.com/
├── login.html
├── styles.css
├── script.js
├── process_login.php
└── dashboard.html (optional, for redirect)
```

### Step 2: Set Proper Permissions
Ensure the PHP file has appropriate permissions:
```bash
chmod 644 process_login.php
chmod 755 /path/to/directory
```

### Step 3: Create session directory (if needed)
```bash
mkdir -p /path/to/session/directory
chmod 755 /path/to/session/directory
```

### Step 4: Configure PHP (optional)
In `php.ini`, ensure these settings:
```ini
session.cookie_httponly = On
session.cookie_secure = On  ; for HTTPS only
session.use_strict_mode = On
session.hash_algorithm = "sha256"
```

### Step 5: Create Dashboard/Home Page
Create a `dashboard.html` file that the user redirects to after login:
```html
<!DOCTYPE html>
<html>
<head><title>Dashboard</title></head>
<body>
    <h1>Welcome to Dashboard</h1>
    <p id="userName"></p>
    <a href="logout.php">Logout</a>
    <script>
        // Display logged-in user information
        document.getElementById('userName').textContent = 'Welcome, ' + (sessionStorage.getItem('username') || 'User');
    </script>
</body>
</html>
```

### Step 6: Test the Application
Navigate to `http://localhost/login.html` in your browser.

---

## 📁 File Structure

```
SecureLogin/
│
├── login.html              # Main login page (HTML5)
├── styles.css              # Responsive styles with dark/light theme
├── script.js               # Client-side validation and interactions
├── process_login.php       # Backend authentication logic
├── dashboard.html          # Sample redirect page after login
├── logout.php              # Session logout handler
├── README.md               # This file
│
└── (Optional) Database Setup/
    └── schema.sql          # Database structure for production use
```

---

## 🚀 Usage

### Basic Flow
1. User navigates to `login.html`
2. Enters username and password
3. JavaScript validates inputs in real-time
4. On submit, form data is sent to `process_login.php`
5. PHP validates credentials and creates secure session
6. Success: Redirect to dashboard
7. Failure: Display error message

### Demo Credentials
Test the application with these credentials:

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | Administrator |
| john_doe | John@123 | User |
| jane_smith | Jane@123 | User |

### Form Features

#### Username Field
- Minimum 3 characters, maximum 30
- Alphanumeric, hyphens, and underscores only
- Real-time validation with error messages

#### Password Field
- Minimum 6 characters required
- Password visibility toggle (eye icon)
- Hidden by default for security

#### Remember Me
- Stores username in browser localStorage
- Not for production on shared computers
- Unchecking removes stored username

#### Buttons
- **Sign In**: Submits form with validation
- **Reset**: Clears all fields and errors

---

## 🔒 Security Features

### Client-Side Security
```javascript
// XSS Prevention
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Input Validation
const pattern = /^[a-zA-Z0-9_-]+$/;
if (!pattern.test(username)) { /* reject */ }
```

### Server-Side Security
```php
// Password Hashing
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
$verified = password_verify($input, $hash);

// Rate Limiting
if ($attempts >= MAX_LOGIN_ATTEMPTS) {
    $_SESSION[$lockoutKey] = time();
}

// Security Headers
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000');
```

### Session Management
- HTTP-only cookies prevent XSS attacks
- Session timeout: 30 minutes default
- IP address verification
- User agent validation
- Secure cookie flags for HTTPS

### Input Sanitization
```php
$username = sanitizeInput($_POST['username']);

function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
```

---

## 🎨 Customization

### Change Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #2563eb;           /* Main blue */
    --primary-dark: #1e40af;      /* Darker blue */
    --success: #10b981;           /* Green */
    --danger: #ef4444;            /* Red */
    --background: #0f172a;        /* Dark background */
}
```

### Modify Form Fields
Add new fields to `login.html`:
```html
<div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
</div>
```

And validate in `script.js`:
```javascript
function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
```

### Change Session Timeout
In `process_login.php`:
```php
define('SESSION_TIMEOUT', 3600); // 1 hour in seconds
```

### Configure Database Connection (Production)
Replace demo users with database:
```php
function authenticateUser($username, $password) {
    $db = new PDO('mysql:host=localhost;dbname=auth_db', 'user', 'pass');
    $stmt = $db->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        return $user;
    }
    return false;
}
```

---

## ✅ Best Practices

### For Development
- [ ] Use HTTPS/SSL certificates
- [ ] Enable error logging: `error_log()`
- [ ] Test with various browsers
- [ ] Validate on both client and server
- [ ] Use prepared statements with database

### For Production
- [ ] Replace demo users with real database
- [ ] Implement proper CSRF token generation
- [ ] Set up database connection pooling
- [ ] Configure email notifications for failed attempts
- [ ] Implement account recovery mechanism
- [ ] Add audit logging for security events
- [ ] Use environment variables for sensitive config
- [ ] Regular security audits and updates

### Password Policy
```php
function validatePasswordStrength($password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return preg_match(
        '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
        $password
    );
}
```

---

## 📱 Responsive Breakpoints

The application is optimized for:
- **Desktop**: 1024px and above (two-column layout)
- **Tablet**: 600px - 1024px (single column)
- **Mobile**: Below 600px (optimized touch targets)

---

## ♿ Accessibility Features

- ARIA labels on all form inputs
- Keyboard navigation support
- Color contrast meets WCAG AA standards
- Focus indicators visible
- Error messages associated with fields
- Semantic HTML structure
- Support for screen readers
- Respects `prefers-reduced-motion` setting

---

## 🐛 Troubleshooting

### Issue: "Invalid request method" error
**Solution**: Ensure form method is POST and request is made via AJAX/Fetch.

### Issue: Session not persisting
**Solution**: Check PHP session configuration and ensure `/tmp` directory is writable.

### Issue: Password toggle not working
**Solution**: Verify JavaScript file is loaded and no console errors exist.

### Issue: CSS not loading
**Solution**: Check file path and ensure `styles.css` is in same directory as `login.html`.

### Issue: PHP errors in logs
**Solution**: Check PHP error_log location and ensure proper permissions.

### Issue: "Remember Me" not working
**Solution**: Verify localStorage is enabled in browser settings.

### Issue: CORS errors with backend
**Solution**: Ensure both frontend and backend are on same domain, or configure CORS headers.

---

## 📚 Additional Resources

### Security References
- [OWASP Top 10](https://owasp.org/Top10/)
- [PHP Security Guide](https://www.php.net/manual/en/security.php)
- [Web Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)

### PHP Functions Used
- `password_hash()` - Secure password hashing
- `password_verify()` - Verify hashed password
- `session_start()` - Initialize session
- `htmlspecialchars()` - Escape HTML
- `filter_var()` - Validate and filter input

### JavaScript Features
- Fetch API for async requests
- Regular expressions for validation
- localStorage for client-side storage
- Event delegation for DOM manipulation

---

## 📄 License

This project is provided as-is for educational and commercial use.

---

## 🤝 Support & Contributions

For issues, improvements, or feature requests:
1. Test thoroughly on your environment
2. Document the issue with steps to reproduce
3. Include browser/server versions
4. Share error logs if available

---

## 📌 Version History

**v1.0.0** (Initial Release)
- Complete login authentication system
- Client-side and server-side validation
- Responsive design
- Security features implemented

---

## ⚡ Quick Start Guide

```bash
# 1. Extract files to web directory
cd /var/www/html
unzip securelogin.zip

# 2. Set permissions
chmod 755 .
chmod 644 *.html *.css *.js *.php

# 3. Start PHP server (for testing)
php -S localhost:8000

# 4. Open in browser
# http://localhost:8000/login.html

# 5. Test with demo credentials
# Username: admin
# Password: Admin@123
```

---

**Happy Coding! 🚀**

For more information, visit the documentation or contact support.
