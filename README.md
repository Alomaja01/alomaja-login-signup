# SecureLogin — Authentication Application

**Version:** 1.0.0 | **Stack:** HTML5 · CSS3 · JavaScript (ES6+) · PHP 7.4+

---

## Quick Start

### Option A — Demo Mode (No Server Required)
1. Open `src/index.html` directly in any modern browser.
2. Use the demo credentials shown on the login page.
3. The app runs in JavaScript-only mode with client-side validation.

### Option B — Full PHP Mode (XAMPP / WAMP / Live Server)
1. Copy the `src/` folder into your web server root (e.g. `C:/xampp/htdocs/securelogin/`)
2. Start Apache.
3. Navigate to `http://localhost/securelogin/index.html`

---

## Demo Credentials

| Username | Password   | Role  |
|----------|------------|-------|
| admin    | Admin@1234 | Admin |
| user1    | User@5678  | User  |

---

## File Structure

```
src/
├── index.html
├── dashboard.html
├── css/
│   ├── style.css
│   └── dashboard.css
├── js/
│   ├── validate.js
│   └── app.js
└── php/
    ├── login.php
    ├── logout.php
    ├── auth_guard.php
    └── forgot.php
docs/
└── documentation.docx
README.md
```
