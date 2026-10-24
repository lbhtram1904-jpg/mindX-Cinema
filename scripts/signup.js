document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');

  if (!form) return;

  const usernameInput = document.getElementById('Username');
  const emailInput = document.getElementById('Email');
  const passwordInput = document.getElementById('Password');
  const verifyPasswordInput = document.getElementById('verifyPassword');

  function setError(input, message) {
    const errorBox = input.parentElement.querySelector('.error-message');
    if (!errorBox) return;

    input.classList.toggle('error', !!message);
    errorBox.textContent = message;
  }

  function validateUsername() {
    const value = usernameInput.value.trim();
    if (!value) {
      setError(usernameInput, 'Please enter your username');
      return false;
    }
    if (value.length < 6 || value.length > 18) {
      setError(usernameInput, 'Username must be 6 to 18 characters');
      return false;
    }
    setError(usernameInput, '');
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setError(emailInput, 'Please enter your email');
      return false;
    }
    if (!emailPattern.test(value)) {
      setError(emailInput, 'Email must be in a valid format');
      return false;
    }
    setError(emailInput, '');
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value.trim();
    if (!value) {
      setError(passwordInput, 'Please enter your password');
      return false;
    }
    if (value.length < 8 || value.length > 20) {
      setError(passwordInput, 'Password must be 8 to 20 characters');
      return false;
    }
    setError(passwordInput, '');
    return true;
  }

  function validateVerifyPassword() {
    const value = verifyPasswordInput.value.trim();
    if (!value) {
      setError(verifyPasswordInput, 'Please confirm your password');
      return false;
    }
    if (value !== passwordInput.value) {
      setError(verifyPasswordInput, 'Password confirmation must match the password');
      return false;
    }
    setError(verifyPasswordInput, '');
    return true;
  }

  usernameInput.addEventListener('blur', validateUsername);
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);
  verifyPasswordInput.addEventListener('blur', validateVerifyPassword);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const validUsername = validateUsername();
    const validEmail = validateEmail();
    const validPassword = validatePassword();
    const validVerify = validateVerifyPassword();

    if (validUsername && validEmail && validPassword && validVerify) {
      alert('Sign up successful!');
      form.reset();
    }
  });
});
