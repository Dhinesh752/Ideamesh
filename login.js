// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  if (passwordField.type === "password") {
    passwordField.type = "text";
    togglePassword.textContent = "🙈";
  } else {
    passwordField.type = "password";
    togglePassword.textContent = "👁️";
  }
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify({
      fullName: user.fullName,
      email: user.email
    }));
    alert("Login successful!");
    window.location.href = "3home.html";
  } else {
    alert("Invalid email or password. Please try again.");
    loginForm.reset();
  }
});
