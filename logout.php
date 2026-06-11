<?php
/**
 * Logout Handler
 * Destroys session and clears cookies
 */

// ===================================
// SESSION CLEANUP
// ===================================

// Set secure session configuration
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'httponly' => true,
    'samesite' => 'Strict'
]);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Get user info before destroying session (for logging purposes)
$username = isset($_SESSION['username']) ? $_SESSION['username'] : 'Unknown';
$logoutTime = date('Y-m-d H:i:s');

// ===================================
// DESTROY SESSION
// ===================================

// Unset all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Delete session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// ===================================
// SECURITY HEADERS
// ===================================

header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// ===================================
// LOG LOGOUT EVENT (Optional)
// ===================================

// Uncomment to enable logout logging
/*
$logFile = __DIR__ . '/logs/logout.log';
if (!is_dir(dirname($logFile))) {
    mkdir(dirname($logFile), 0755, true);
}
$logMessage = "[{$logoutTime}] User '{$username}' logged out from IP: " . 
              ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
file_put_contents($logFile, $logMessage, FILE_APPEND);
*/

// ===================================
// SEND RESPONSE
// ===================================

$response = [
    'success' => true,
    'message' => 'You have been successfully logged out.',
    'redirect' => 'login.html'
];

echo json_encode($response);

// Optional: Redirect directly
// header('Location: login.html');
// exit;

?>
