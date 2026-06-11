<?php
/**
 * SecureGate — Dashboard (Protected Page)
 * dashboard.php  |  Version 1.0.0
 */

session_name('securegate_sess');
session_start();

require_once __DIR__ . '/config/config.php';

// ── Auth Guard ────────────────────────────────────────────────────────────────
if (!isset($_SESSION['user_logged_in']) || $_SESSION['user_logged_in'] !== true) {
    $_SESSION['login_error'] = 'You must be signed in to access that page.';
    header('Location: index.php');
    exit();
}

// ── Session Timeout (idle) ────────────────────────────────────────────────────
if (isset($_SESSION['login_time'])) {
    if ((time() - $_SESSION['login_time']) > SESSION_LIFETIME) {
        session_destroy();
        session_start();
        $_SESSION['login_error'] = 'Your session has expired. Please sign in again.';
        header('Location: index.php');
        exit();
    }
}
// Refresh activity time
$_SESSION['login_time'] = time();

// ── User Data ─────────────────────────────────────────────────────────────────
$displayName = htmlspecialchars($_SESSION['display_name'] ?? 'User');
$username    = htmlspecialchars($_SESSION['username']     ?? '');
$role        = htmlspecialchars($_SESSION['role']         ?? '');
$email       = htmlspecialchars($_SESSION['email']        ?? '');
$loginIp     = htmlspecialchars($_SESSION['login_ip']     ?? 'unknown');
$loginTime   = isset($_SESSION['login_time']) ? date('D, d M Y  H:i:s', $_SESSION['login_time']) : '—';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dashboard — SecureGate</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="assets/css/style.css"/>
</head>
<body>

  <div class="bg-layer">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="grid-overlay"></div>
  </div>

  <main class="main-wrap dashboard-wrap" style="max-width:680px;">

    <!-- Brand -->
    <div class="brand-strip">
      <div class="brand-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#E8FF47"/>
          <path d="M14 6v4M14 18v4M6 14h4M18 14h4" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="14" cy="14" r="3.5" fill="#111"/>
        </svg>
      </div>
      <span class="brand-name">SecureGate</span>
    </div>

    <div class="card dashboard-card">

      <div class="dashboard-header">
        <div>
          <div class="welcome-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            </svg>
            Authentication Successful
          </div>
          <h1 class="dashboard-title">Hello, <span><?= $displayName ?></span> 👋</h1>
          <p class="dashboard-subtitle">You're securely signed in to your account.</p>
        </div>
        <a href="auth/logout.php" class="btn-logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Sign Out
        </a>
      </div>

      <!-- Info Tiles -->
      <div class="info-grid">
        <div class="info-tile">
          <div class="info-tile-label">Username</div>
          <div class="info-tile-value"><?= $username ?></div>
        </div>
        <div class="info-tile">
          <div class="info-tile-label">Role</div>
          <div class="info-tile-value"><?= $role ?></div>
        </div>
        <div class="info-tile">
          <div class="info-tile-label">Email</div>
          <div class="info-tile-value" style="font-size:.88rem"><?= $email ?></div>
        </div>
        <div class="info-tile">
          <div class="info-tile-label">Login IP</div>
          <div class="info-tile-value"><?= $loginIp ?></div>
        </div>
        <div class="info-tile" style="grid-column: 1/-1">
          <div class="info-tile-label">Session Started</div>
          <div class="info-tile-value" style="font-size:.9rem"><?= $loginTime ?></div>
        </div>
      </div>

      <p style="font-size:.82rem; color:var(--text-dim); text-align:center;">
        Session auto-expires after 30 minutes of inactivity.
      </p>

    </div><!-- .dashboard-card -->

    <p class="page-footer">© 2026 SecureGate &nbsp;·&nbsp; Built with PHP &amp; Vanilla JS</p>
  </main>

</body>
</html>
