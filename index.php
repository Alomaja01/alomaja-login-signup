<?php
session_start();

// Redirect if already logged in
if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
    header('Location: dashboard.php');
    exit();
}

$error   = isset($_SESSION['login_error'])   ? $_SESSION['login_error']   : '';
$success = isset($_SESSION['login_success']) ? $_SESSION['login_success'] : '';
unset($_SESSION['login_error'], $_SESSION['login_success']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SecureGate — Sign In</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="assets/css/style.css"/>
</head>
<body>

  <!-- Animated background -->
  <div class="bg-layer">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="grid-overlay"></div>
  </div>

  <main class="main-wrap">

    <!-- Branding strip -->
    <div class="brand-strip" aria-label="Application brand">
      <div class="brand-icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#E8FF47"/>
          <path d="M14 6v4M14 18v4M6 14h4M18 14h4" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="14" cy="14" r="3.5" fill="#111"/>
        </svg>
      </div>
      <span class="brand-name">SecureGate</span>
    </div>

    <!-- Card -->
    <div class="card" role="main">

      <header class="card-header">
        <h1 class="card-title">Welcome back</h1>
        <p class="card-subtitle">Sign in to access your account</p>
      </header>

      <!-- Flash messages -->
      <?php if ($error): ?>
        <div class="alert alert-error" role="alert" aria-live="assertive">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <?= htmlspecialchars($error) ?>
        </div>
      <?php endif; ?>
      <?php if ($success): ?>
        <div class="alert alert-success" role="alert" aria-live="polite">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <?= htmlspecialchars($success) ?>
        </div>
      <?php endif; ?>

      <!-- Login Form -->
      <form id="loginForm" method="POST" action="auth/login.php" novalidate>
        <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?? '' ?>"/>

        <!-- Username -->
        <div class="field-group" id="group-username">
          <label class="field-label" for="username">Username</label>
          <div class="input-wrap">
            <span class="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <input
              type="text"
              id="username"
              name="username"
              class="field-input"
              placeholder="Enter your username"
              autocomplete="username"
              maxlength="50"
              aria-required="true"
              aria-describedby="username-error"
            />
          </div>
          <span class="field-error" id="username-error" role="alert" aria-live="polite"></span>
        </div>

        <!-- Password -->
        <div class="field-group" id="group-password">
          <label class="field-label" for="password">Password</label>
          <div class="input-wrap">
            <span class="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <input
              type="password"
              id="password"
              name="password"
              class="field-input"
              placeholder="Enter your password"
              autocomplete="current-password"
              maxlength="100"
              aria-required="true"
              aria-describedby="password-error"
            />
            <button type="button" class="toggle-pw" id="togglePw" aria-label="Toggle password visibility">
              <svg class="eye-open" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>
              </svg>
              <svg class="eye-closed hidden" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <span class="field-error" id="password-error" role="alert" aria-live="polite"></span>
        </div>

        <!-- Password strength indicator -->
        <div class="strength-wrap" id="strengthWrap" aria-hidden="true">
          <div class="strength-bar"><div class="strength-fill" id="strengthFill"></div></div>
          <span class="strength-label" id="strengthLabel"></span>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="submitBtn">
            <span class="btn-text">Sign In</span>
            <span class="btn-spinner" aria-hidden="true"></span>
          </button>
          <button type="reset" class="btn btn-ghost" id="resetBtn">Reset</button>
        </div>

      </form>

      <footer class="card-footer">
        <p>Demo credentials: <strong>admin</strong> / <strong>Admin@1234</strong></p>
      </footer>

    </div><!-- .card -->

    <p class="page-footer">© 2026 SecureGate &nbsp;·&nbsp; Built with PHP &amp; Vanilla JS</p>
  </main>

  <script src="assets/js/validate.js"></script>
</body>
</html>
