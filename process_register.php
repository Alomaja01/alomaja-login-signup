<?php
/**
 * User Registration Backend
 * Handles new user registration with validation and account creation
 */

// ===================================
// CONFIGURATION
// ===================================
define('APP_NAME', 'SecureLogin');

// ===================================
// SECURITY HEADERS
// ===================================
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Cache-Control: no-cache, no-store, must-revalidate');

// ===================================
// REQUEST VALIDATION
// ===================================

/**
 * Check if request method is POST
 */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method', 405);
}

/**
 * Check if request is AJAX
 */
if (!isAjaxRequest()) {
    sendResponse(false, 'Invalid request', 400);
}

/**
 * Verify timestamp
 */
$timestamp = isset($_POST['timestamp']) ? intval($_POST['timestamp']) : 0;
$currentTime = time() * 1000;
if (abs($currentTime - $timestamp) > 60000) {
    sendResponse(false, 'Request expired. Please try again.', 400);
}

// ===================================
// INPUT VALIDATION
// ===================================

/**
 * Get and validate full name
 */
$fullName = isset($_POST['fullName']) ? sanitizeInput($_POST['fullName']) : '';
if (empty($fullName)) {
    sendResponse(false, 'Full name is required');
}

if (strlen($fullName) < 2 || strlen($fullName) > 100) {
    sendResponse(false, 'Invalid full name length');
}

if (!preg_match("/^[a-zA-Z\s'-]+$/", $fullName)) {
    sendResponse(false, 'Full name contains invalid characters');
}

/**
 * Get and validate email
 */
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
if (empty($email)) {
    sendResponse(false, 'Email address is required');
}

if (!validateEmail($email)) {
    sendResponse(false, 'Please enter a valid email address');
}

if (strlen($email) > 255) {
    sendResponse(false, 'Email address is too long');
}

/**
 * Get and validate username
 */
$username = isset($_POST['username']) ? sanitizeInput($_POST['username']) : '';
if (empty($username)) {
    sendResponse(false, 'Username is required');
}

if (strlen($username) < 3 || strlen($username) > 30) {
    sendResponse(false, 'Username must be between 3 and 30 characters');
}

if (!preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
    sendResponse(false, 'Username can only contain letters, numbers, hyphens, and underscores');
}

/**
 * Get and validate password
 */
$password = isset($_POST['password']) ? $_POST['password'] : '';
if (empty($password)) {
    sendResponse(false, 'Password is required');
}

if (strlen($password) < 8 || strlen($password) > 100) {
    sendResponse(false, 'Password must be between 8 and 100 characters');
}

if (!validatePasswordStrength($password)) {
    sendResponse(false, 'Password must contain uppercase, lowercase, number, and special character');
}

// ===================================
// DEMO USER REGISTRATION (For Demo - Use Real DB in Production)
// ===================================

/**
 * In production, check database for existing username/email and insert new user
 * For demo, we'll just validate and return success
 */

// Simulated database users (in production, query actual database)
$existingUsers = [
    'admin',
    'john_doe',
    'jane_smith'
];

$existingEmails = [
    'admin@example.com',
    'john@example.com',
    'jane@example.com'
];

// ===================================
// CHECK FOR EXISTING ACCOUNTS
// ===================================

/**
 * Check if username already exists
 */
if (in_array(strtolower($username), array_map('strtolower', $existingUsers))) {
    sendResponse(false, 'This username is already taken. Please choose a different one.', 400, 'username');
}

/**
 * Check if email already exists
 */
if (in_array(strtolower($email), array_map('strtolower', $existingEmails))) {
    sendResponse(false, 'This email address is already registered. Please login or use a different email.', 400, 'email');
}

// ===================================
// CREATE NEW USER ACCOUNT
// ===================================

try {
    // Hash the password using bcrypt
    $passwordHash = hashPassword($password);
    
    // In production, insert into database:
    // INSERT INTO users (username, email, password, full_name, created_at, is_active) 
    // VALUES (?, ?, ?, ?, NOW(), 1)
    
    // For demo purposes, we'll simulate success
    $userId = md5($username . time());
    
    // Log registration
    logRegistration($username, $email, $fullName);
    
    // Prepare success response
    $response = [
        'success' => true,
        'message' => 'Account created successfully! Redirecting to login...',
        'user' => [
            'id' => $userId,
            'username' => $username,
            'email' => $email,
            'fullName' => $fullName
        ]
    ];
    
    echo json_encode($response);
    exit;
    
} catch (Exception $e) {
    error_log('Registration error: ' . $e->getMessage());
    sendResponse(false, 'An error occurred during registration. Please try again later.', 500);
}

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Sanitize user input
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Check if request is AJAX
 */
function isAjaxRequest() {
    return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') ||
           (isset($_POST['timestamp']));
}

/**
 * Validate email format
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate password strength
 * Must have: uppercase, lowercase, number, special character, min 8 chars
 */
function validatePasswordStrength($password) {
    $hasUppercase = preg_match('/[A-Z]/', $password);
    $hasLowercase = preg_match('/[a-z]/', $password);
    $hasNumber = preg_match('/\d/', $password);
    $hasSpecial = preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password);
    
    return $hasUppercase && $hasLowercase && $hasNumber && $hasSpecial;
}

/**
 * Hash password using bcrypt
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
}

/**
 * Verify password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Get client IP address
 */
function getClientIp() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED'])) {
        return $_SERVER['HTTP_X_FORWARDED'];
    } elseif (!empty($_SERVER['HTTP_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_FORWARDED_FOR'];
    } elseif (!empty($_SERVER['HTTP_FORWARDED'])) {
        return $_SERVER['HTTP_FORWARDED'];
    } else {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}

/**
 * Log registration attempt
 */
function logRegistration($username, $email, $fullName) {
    $logFile = __DIR__ . '/logs/registration.log';
    
    // Create logs directory if it doesn't exist
    if (!is_dir(dirname($logFile))) {
        @mkdir(dirname($logFile), 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $ipAddress = getClientIp();
    $logMessage = "[{$timestamp}] New registration - Username: {$username}, Email: {$email}, Full Name: {$fullName}, IP: {$ipAddress}\n";
    
    @file_put_contents($logFile, $logMessage, FILE_APPEND);
}

/**
 * Send JSON response
 */
function sendResponse($success, $message, $statusCode = 200, $field = null) {
    http_response_code($statusCode);
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($field) {
        $response['field'] = $field;
    }
    
    echo json_encode($response);
    exit;
}

// ===================================
// PRODUCTION DATABASE EXAMPLE
// ===================================
/*
 * For production use, implement actual database operations:
 *
 * try {
 *     $db = new PDO(
 *         'mysql:host=localhost;dbname=securelogin',
 *         'db_user',
 *         'db_password'
 *     );
 *     
 *     // Check if username exists
 *     $stmt = $db->prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)');
 *     $stmt->execute([$username]);
 *     if ($stmt->rowCount() > 0) {
 *         sendResponse(false, 'Username already exists', 400, 'username');
 *     }
 *     
 *     // Check if email exists
 *     $stmt = $db->prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)');
 *     $stmt->execute([$email]);
 *     if ($stmt->rowCount() > 0) {
 *         sendResponse(false, 'Email already registered', 400, 'email');
 *     }
 *     
 *     // Insert new user
 *     $passwordHash = hashPassword($password);
 *     $stmt = $db->prepare('
 *         INSERT INTO users (username, email, password, full_name, created_at, is_active) 
 *         VALUES (?, ?, ?, ?, NOW(), 1)
 *     ');
 *     $stmt->execute([$username, $email, $passwordHash, $fullName]);
 *     
 *     $userId = $db->lastInsertId();
 *     
 *     // Send success response
 *     // ...
 *     
 * } catch (PDOException $e) {
 *     error_log('Database error: ' . $e->getMessage());
 *     sendResponse(false, 'Database error', 500);
 * }
 */

?>
