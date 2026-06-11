# SecureLogin - Installation & Setup Guide

## 🚀 Quick Start (5 Minutes)

### Option 1: XAMPP/WAMP/LAMP (Windows/Mac/Linux)

**Step 1: Extract Files**
```
C:\xampp\htdocs\securelogin\
├── login.html
├── styles.css
├── script.js
├── process_login.php
├── logout.php
├── dashboard.html
└── README.md
```

**Step 2: Start Server**
- XAMPP: Click "Start" for Apache & MySQL
- WAMP: Click tray icon → Restart services
- LAMP: `sudo systemctl start apache2`

**Step 3: Access Application**
- Navigate to: `http://localhost/securelogin/login.html`
- Test with demo credentials (see below)

**Step 4: Test Credentials**
```
Username: admin
Password: Admin@123

OR

Username: john_doe
Password: John@123

OR

Username: jane_smith
Password: Jane@123
```

---

### Option 2: PHP Built-in Server (For Testing)

```bash
# Navigate to project directory
cd /path/to/securelogin

# Start built-in server
php -S localhost:8000

# Open browser
# http://localhost:8000/login.html
```

**Note:** Built-in server is for development only, not production.

---

### Option 3: Docker (Production-Ready)

**Create Dockerfile:**
```dockerfile
FROM php:8.1-apache

# Enable PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable mod_rewrite
RUN a2enmod rewrite

# Copy application files
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html/

EXPOSE 80
```

**Build and Run:**
```bash
docker build -t securelogin .
docker run -d -p 80:80 securelogin
```

---

## 📋 File Checklist

Before running the application, ensure you have:

- [ ] `login.html` - Main login page
- [ ] `styles.css` - Styling file
- [ ] `script.js` - Client-side validation
- [ ] `process_login.php` - Backend authentication
- [ ] `logout.php` - Session cleanup
- [ ] `dashboard.html` - Post-login page
- [ ] `README.md` - Documentation

---

## ⚙️ Configuration

### PHP Settings (`php.ini`)

Required settings for security:
```ini
; Session Security
session.cookie_httponly = On
session.use_strict_mode = On
session.cookie_samesite = "Strict"
session.hash_algorithm = "sha256"

; Error Handling
error_reporting = E_ALL
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log

; File Uploads (if needed)
file_uploads = On
upload_max_filesize = 10M
post_max_size = 10M

; Default Charset
default_charset = "UTF-8"
```

### Environment Configuration

For production, create a `.env` file:
```env
DB_HOST=localhost
DB_USER=admin
DB_PASS=secure_password
DB_NAME=securelogin

ENVIRONMENT=production
SESSION_TIMEOUT=1800
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=900

ADMIN_EMAIL=admin@example.com
```

---

## 🗄️ Database Setup (Production)

### MySQL Schema

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS securelogin;
USE securelogin;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Create login history table
CREATE TABLE login_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    success BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_login_time (login_time)
);

-- Create sessions table
CREATE TABLE sessions (
    session_id VARCHAR(32) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Insert demo users
INSERT INTO users (username, email, password, full_name) VALUES 
('admin', 'admin@example.com', '$2y$10$nOUIs5kJ7naTuTQC6Ar2OPST9/PgBkqquzi8Aw7gu.eIGEJwFt892', 'Administrator'),
('john_doe', 'john@example.com', '$2y$10$j7R7Q0kJ2naTuTQC6Ar2OPST9/PgBkqquzi8Aw7gu.eIGEJwFt892', 'John Doe'),
('jane_smith', 'jane@example.com', '$2y$10$k9U8R1kJ2naTuTQC6Ar2OPST9/PgBkqquzi8Aw7gu.eIGEJwFt892', 'Jane Smith');
```

### Update `process_login.php`

Replace demo user lookup with database query:
```php
function authenticateUser($username, $password) {
    try {
        // Get database connection
        $db = new PDO(
            'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'],
            $_ENV['DB_USER'],
            $_ENV['DB_PASS']
        );
        
        $stmt = $db->prepare('SELECT id, username, email, full_name, password FROM users WHERE username = ? AND is_active = 1');
        $stmt->execute([$username]);
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // Log successful login
            logLoginAttempt($db, $user['id'], true);
            return $user;
        }
        
        // Log failed login
        logLoginAttempt($db, $user['id'] ?? null, false);
        return false;
    } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());
        return false;
    }
}

function logLoginAttempt($db, $userId, $success) {
    $stmt = $db->prepare('
        INSERT INTO login_history (user_id, ip_address, user_agent, success) 
        VALUES (?, ?, ?, ?)
    ');
    $stmt->execute([
        $userId,
        getClientIp(),
        $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        $success ? 1 : 0
    ]);
}
```

---

## 🔒 Security Hardening

### 1. HTTPS Configuration (Apache)

```apache
# .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirect HTTP to HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Disable directory listing
    Options -Indexes
    
    # Prevent access to sensitive files
    <FilesMatch "\.(env|json|log)$">
        Deny from all
    </FilesMatch>
</IfModule>
```

### 2. Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/html/securelogin;
    index login.html;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }

    # Deny access to sensitive files
    location ~ /\.(env|git|log) {
        deny all;
    }
}
```

### 3. PHP Security

```php
// security.php - Include in all PHP files
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

// Prevent SQL injection
define('DB_CHARSET', 'utf8mb4');

// CSRF Token generation
function generateToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Rate limiting
function checkRateLimit($key, $limit = 5, $window = 900) {
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 1, 'time' => time()];
        return true;
    }
    
    $elapsed = time() - $_SESSION[$key]['time'];
    if ($elapsed > $window) {
        $_SESSION[$key] = ['count' => 1, 'time' => time()];
        return true;
    }
    
    if ($_SESSION[$key]['count'] >= $limit) {
        return false;
    }
    
    $_SESSION[$key]['count']++;
    return true;
}
```

---

## 🧪 Testing

### Unit Tests (PHP)

```php
// test_auth.php
class AuthTest {
    public function testValidPassword() {
        $hash = password_hash('Test@123', PASSWORD_BCRYPT);
        assert(password_verify('Test@123', $hash));
    }
    
    public function testInvalidPassword() {
        $hash = password_hash('Test@123', PASSWORD_BCRYPT);
        assert(!password_verify('WrongPassword', $hash));
    }
    
    public function testUsernameValidation() {
        $username = 'test_user';
        assert(preg_match('/^[a-zA-Z0-9_-]+$/', $username));
    }
}

$test = new AuthTest();
$test->testValidPassword();
$test->testInvalidPassword();
$test->testUsernameValidation();
echo "All tests passed!";
```

### Browser Testing Checklist

- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)
- [ ] Test on mobile browsers
- [ ] Test form submission
- [ ] Test password visibility toggle
- [ ] Test remember me feature
- [ ] Test validation messages
- [ ] Test keyboard navigation
- [ ] Test with JavaScript disabled (graceful degradation)
- [ ] Test with slow network (3G)
- [ ] Test with screen reader

---

## 🐛 Debugging Tips

### Enable Debug Mode

```php
// process_login.php
define('DEBUG_MODE', true);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}
```

### Check PHP Logs

```bash
# Linux/Mac
tail -f /var/log/apache2/error.log
tail -f /var/log/php_errors.log

# Windows (XAMPP)
# C:\xampp\apache\logs\error.log
# C:\xampp\php\logs\php_error.log
```

### Browser Console

Open Developer Tools (F12) to check:
- JavaScript errors in Console
- Network requests in Network tab
- Session cookies in Application → Cookies
- localStorage data in Application → Storage

### Test with cURL

```bash
# Test login endpoint
curl -X POST http://localhost/securelogin/process_login.php \
  -d "username=admin&password=Admin@123&rememberMe=1&timestamp=$(date +%s)000" \
  -H "Content-Type: application/x-www-form-urlencoded"
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Update demo users with real database
- [ ] Enable HTTPS/SSL
- [ ] Configure security headers
- [ ] Set up error logging
- [ ] Configure backup strategy
- [ ] Set strong session timeouts
- [ ] Implement rate limiting
- [ ] Add CAPTCHA for login page
- [ ] Set up monitoring/alerts
- [ ] Regular security updates
- [ ] Perform penetration testing
- [ ] Document disaster recovery

### Deployment Steps

```bash
# 1. Pull/clone repository
git clone <your-repo> /var/www/securelogin

# 2. Install dependencies
composer install  # if using Composer

# 3. Set permissions
chmod 755 /var/www/securelogin
chmod 644 /var/www/securelogin/*.{html,css,js,php}
chmod 700 /var/www/securelogin/logs

# 4. Configure environment
cp .env.example .env
# Edit .env with production values

# 5. Update database
mysql -u root -p securelogin < schema.sql

# 6. Test application
curl -I https://yourdomain.com/login.html

# 7. Set up monitoring
# Configure log rotation, alerts, backups, etc.
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Session not working:**
- Check `/tmp` directory permissions
- Verify `session.save_path` in php.ini
- Ensure cookies are enabled

**CSS/JS not loading:**
- Clear browser cache (Ctrl+Shift+Delete)
- Check file paths are correct
- Verify file permissions (644)

**PHP errors:**
- Check error logs
- Verify PHP version (7.4+)
- Ensure required extensions are enabled

**Database connection fails:**
- Verify credentials in configuration
- Check MySQL service is running
- Ensure database and tables exist

---

## 📚 Additional Resources

- [PHP Security Best Practices](https://www.php.net/manual/en/security.php)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Mozilla Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)
- [SSL/TLS Best Practices](https://wiki.mozilla.org/Security/Server_Side_TLS)

---

**Happy Coding! 🎉**
