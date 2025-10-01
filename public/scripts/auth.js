const form = document.getElementById("signupForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// Real-time validation
username.addEventListener("input", validateUsername);
password.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validateConfirmPassword);

function validateUsername() {
  const formGroup = username.parentElement;
  const error = document.getElementById("usernameError");

  if (username.value.length < 3) {
    formGroup.classList.add("invalid");
    formGroup.classList.remove("valid");
    error.style.display = "block";
    return false;
  } else {
    formGroup.classList.remove("invalid");
    formGroup.classList.add("valid");
    error.style.display = "none";
    return true;
  }
}

function validatePassword() {
  const formGroup = password.parentElement;
  const error = document.getElementById("passwordError");

  if (password.value.length < 6) {
    formGroup.classList.add("invalid");
    formGroup.classList.remove("valid");
    error.style.display = "block";
    return false;
  } else {
    formGroup.classList.remove("invalid");
    formGroup.classList.add("valid");
    error.style.display = "none";

    // Re-validate confirm password if it has a value
    if (confirmPassword.value) {
      validateConfirmPassword();
    }
    return true;
  }
}

function validateConfirmPassword() {
  const formGroup = confirmPassword.parentElement;
  const error = document.getElementById("confirmPasswordError");

  if (confirmPassword.value !== password.value) {
    formGroup.classList.add("invalid");
    formGroup.classList.remove("valid");
    error.style.display = "block";
    return false;
  } else {
    formGroup.classList.remove("invalid");
    formGroup.classList.add("valid");
    error.style.display = "none";
    return true;
  }
}

// Form submission validation
form.addEventListener("submit", function (e) {
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();

  if (!isUsernameValid || !isPasswordValid || !isConfirmPasswordValid) {
    e.preventDefault();
  }
});
