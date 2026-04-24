// Toggle password visibility for new password
const toggleNewPassword = document.getElementById("toggleNewPassword");
const newPasswordField = document.getElementById("newPassword");

toggleNewPassword.addEventListener("click", function () {
  if (newPasswordField.type === "password") {
    newPasswordField.type = "text";
    toggleNewPassword.textContent = "🙈";
  } else {
    newPasswordField.type = "password";
    toggleNewPassword.textContent = "👁️";
  }
});

// Toggle password visibility for confirm password
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPasswordField = document.getElementById("confirmPassword");

toggleConfirmPassword.addEventListener("click", function () {
  if (confirmPasswordField.type === "password") {
    confirmPasswordField.type = "text";
    toggleConfirmPassword.textContent = "🙈";
  } else {
    confirmPasswordField.type = "password";
    toggleConfirmPassword.textContent = "👁️";
  }
});

// Verify account
const verifyBtn = document.getElementById("verifyBtn");
const verifySection = document.getElementById("verifySection");
const resetSection = document.getElementById("resetSection");

verifyBtn.addEventListener("click", function () {
  const email = document.getElementById("email").value.trim();
  const dob = document.getElementById("dob").value;

  if (!email || !dob) {
    alert("Please enter both email and date of birth.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.dob === dob);

  if (user) {
    verifySection.style.display = "none";
    resetSection.style.display = "block";
  } else {
    alert("No account found with that email and date of birth.");
  }
});

// Reset password
const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", function () {
  const email = document.getElementById("email").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!newPassword || !confirmPassword) {
    alert("Please enter and confirm the new password.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.email === email);

  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Password reset successful! You can now log in with your new password.");
    window.location.href = "1login.html";
  } else {
    alert("Error: User not found.");
  }
});