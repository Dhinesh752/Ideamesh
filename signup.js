// ==================== GOOGLE SIGN-IN LOGIC ====================
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE"; // Replace with your Google Client ID

// Initialize Google Sign-In
function initializeGoogleSignIn() {
  const googleSignInBtn = document.getElementById("googleSignInBtn");
  
  googleSignInBtn.addEventListener("click", () => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleSignInSuccess,
    });

    // Trigger the One Tap flow or redirect to Google Sign-In
    google.accounts.id.renderButton(
      googleSignInBtn,
      {
        type: "standard",
        size: "large",
        text: "signin_with",
      }
    );

    // Alternative: Use popup flow
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Show custom popup if needed
        showGoogleSignInPopup();
      }
    });
  });
}

// Handle Google Sign-In Success
function handleGoogleSignInSuccess(response) {
  const token = response.credential;
  
  // Decode JWT token to get user data
  const userData = parseJwt(token);
  
  // Auto-fill the form with Google data
  autoFillFormWithGoogleData(userData);
  
  // Save Google user to localStorage
  saveGoogleUser(userData, token);
  
  alert("✅ Signed in with Google! Please review and confirm your details.");
}

// Parse JWT Token
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// Auto-fill Form with Google Data
function autoFillFormWithGoogleData(userData) {
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const dobInput = document.getElementById("dob");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  // Fill available fields
  if (userData.name) {
    fullNameInput.value = userData.name;
  }

  if (userData.email) {
    emailInput.value = userData.email;
  }

  // DOB: Google OAuth doesn't provide DOB by default
  // User needs to enter it manually
  dobInput.value = ""; // User will fill this
  dobInput.required = true;

  // Generate a secure random password for Google signup
  const generatedPassword = generateSecurePassword();
  passwordInput.value = generatedPassword;
  confirmPasswordInput.value = generatedPassword;

  // Make password fields read-only for Google signup
  passwordInput.readOnly = true;
  confirmPasswordInput.readOnly = true;

  // Add visual indicator
  fullNameInput.style.backgroundColor = "#e8f5e9";
  emailInput.style.backgroundColor = "#e8f5e9";
  passwordInput.style.backgroundColor = "#fff9c4";
  confirmPasswordInput.style.backgroundColor = "#fff9c4";

  // Mark form as Google-signed
  document.getElementById("signupForm").dataset.googleSignup = "true";
}

// Generate Secure Random Password
function generateSecurePassword() {
  const length = 16;
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Save Google User to localStorage
function saveGoogleUser(userData, token) {
  const googleUser = {
    fullName: userData.name || "Google User",
    email: userData.email,
    dob: "", // Will be filled by user
    password: generateSecurePassword(),
    googleId: userData.sub,
    googleToken: token,
    signupMethod: "google",
    createdAt: new Date().toISOString(),
  };
  
  sessionStorage.setItem("googleUserData", JSON.stringify(googleUser));
}

// Show Custom Google Sign-In Popup
function showGoogleSignInPopup() {
  // This can be customized as needed
  console.log("Google Sign-In Popup triggered");
}

// ==================== ORIGINAL FORM LOGIC ====================

// Toggle password visibility
const togglePassword1 = document.getElementById("togglePassword1");
const passwordField = document.getElementById("password");

togglePassword1.addEventListener("click", function () {
  if (passwordField.readOnly) {
    alert("⚠️ Password is auto-generated for Google Sign-In. Cannot be changed here.");
    return;
  }

  if (passwordField.type === "password") {
    passwordField.type = "text";
    togglePassword1.textContent = "🙈";
  } else {
    passwordField.type = "password";
    togglePassword1.textContent = "👁️";
  }
});

const togglePassword2 = document.getElementById("togglePassword2");
const confirmPasswordField = document.getElementById("confirmPassword");

togglePassword2.addEventListener("click", function () {
  if (confirmPasswordField.readOnly) {
    return;
  }

  if (confirmPasswordField.type === "password") {
    confirmPasswordField.type = "text";
    togglePassword2.textContent = "🙈";
  } else {
    confirmPasswordField.type = "password";
    togglePassword2.textContent = "👁️";
  }
});

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const dob = document.getElementById("dob").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validation
  if (!fullName || !email || !dob || !password || !confirmPassword) {
    alert("❌ Please complete all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("❌ Passwords do not match.");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("❌ Please enter a valid email address.");
    return;
  }

  // Validate DOB (must be at least 13 years old)
  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  if (age < 13) {
    alert("❌ You must be at least 13 years old to sign up.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  if (users.some(user => user.email === email)) {
    alert("❌ Email already registered. Please use a different email.");
    return;
  }

  // Prepare user data
  const newUser = {
    fullName,
    email,
    dob,
    password, // In production, hash this!
    signupMethod: document.getElementById("signupForm").dataset.googleSignup
      ? "google"
      : "manual",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Clear session data if Google signup
  sessionStorage.removeItem("googleUserData");

  alert("✅ Signup successful! Your account has been created.");
  signupForm.reset();

  // Reset field styles
  document.getElementById("fullName").style.backgroundColor = "";
  document.getElementById("email").style.backgroundColor = "";
  document.getElementById("password").style.backgroundColor = "";
  document.getElementById("confirmPassword").style.backgroundColor = "";

  // Redirect to login page
  window.location.href = "1login.html";
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  initializeGoogleSignIn();
});
