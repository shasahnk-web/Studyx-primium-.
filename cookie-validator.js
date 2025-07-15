// 🔐 COOKIE VALIDATION UTILITIES

// Helper functions for cookie management
function setCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Simple cookie check (from scripts/cookies-validator.js)
function checkCookie() {
  const hasValidCookie = getCookie('🚀') ||
    getCookie('accessToken') ||
    getCookie('keyGeneratedTime') ||
    getCookie('studyera_auth');

  if (!hasValidCookie) {
    window.location.href = '/login.html';
  }
}

// Direct auth check (from scripts/auth.js)
function checkAuth() {
  const isAuth = getCookie("studyera_auth");
  if (!isAuth) {
    window.location.href = "/auth.html";
  }
}

// Direct login check (from scripts/page-inline.js)
function checkLogin() {
  if (!getCookie('🚀')) {
    window.location.href = '/login.html';
  }
}

// Clear cookie functions
function clearAuthCookies() {
  setCookie('studyera_auth', '', -1);
}

function clearLoginCookies() {
  setCookie('🚀', '', -1);
  setCookie('accessToken', '', -1);
  setCookie('keyGeneratedTime', '', -1);
}

function clearAllCookies() {
  clearAuthCookies();
  clearLoginCookies();
}

// Validation functions
function validateAuthAccess() {
  const studyeraAuth = getCookie('studyera_auth');

  if (!studyeraAuth || studyeraAuth !== '1') {
    console.log('Auth validation failed: studyera_auth cookie missing or invalid');
    return {
      isValid: false,
      message: 'Authentication required'
    };
  }

  return {
    isValid: true,
    message: 'Authentication valid'
  };
}

function validateLoginAccess() {
  const access = getCookie('🚀');
  const token = getCookie('accessToken');
  const time = getCookie('keyGeneratedTime');

  if (!access || !token || !time) {
    console.log('Login validation failed: Missing required cookies');
    return {
      isValid: false,
      message: 'Login key not fully generated'
    };
  }

  const now = Date.now();
  const generatedTime = parseInt(time);
  
  if (isNaN(generatedTime)) {
    console.log('Login validation failed: Invalid timestamp format');
    clearLoginCookies();
    return {
      isValid: false,
      message: 'Invalid timestamp'
    };
  }
  
  const hoursPassed = (now - generatedTime) / (1000 * 60 * 60);

  if (hoursPassed >= 30) {
    console.log('Login validation failed: Access expired');
    clearLoginCookies();
    return {
      isValid: false,
      message: 'Login access expired'
    };
  }

  return {
    isValid: true,
    message: 'Login access granted',
    hoursRemaining: Math.floor(30 - hoursPassed)
  };
}

// Complete validation (both auth and login)
function validateBatchAccess() {
  // First check authentication
  const authValidation = validateAuthAccess();
  if (!authValidation.isValid) {
    return authValidation;
  }
  
  // Then check login shortener access
  const loginValidation = validateLoginAccess();
  if (!loginValidation.isValid) {
    return loginValidation;
  }
  
  // Both validations passed
  return {
    isValid: true,
    message: 'Full access granted',
    hoursRemaining: loginValidation.hoursRemaining
  };
}

// Set cookie functions - simple and direct
function setAuthCookies() {
  setCookie('studyera_auth', '1', 30);
  console.log('Auth cookies set successfully');
  return true;
}

function setLoginCookies() {
  const now = Date.now();
  setCookie('🚀', 'authorized', 30);
  setCookie('accessToken', 'validated', 30);
  setCookie('keyGeneratedTime', now.toString(), 30);
  console.log('Login cookies set successfully with timestamp:', now);
  return true;
}

function setAllAccessCookies() {
  setAuthCookies();
  setLoginCookies();
  console.log('All access cookies set successfully');
  return true;
}
