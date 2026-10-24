document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  if (!form) return;

  const usernameInput = document.getElementById('Username');
  const passwordInput = document.getElementById('password');

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
      setError(usernameInput, 'username từ 6 đến 18 ký tự');
      return false;
    }
    setError(usernameInput, '');
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value.trim();
    if (!value) {
      setError(passwordInput, 'Please enter your password');
      return false;
    }
    if (value.length < 8 || value.length > 20) {
      setError(passwordInput, 'password từ 8 đến 20 ký tự');
      return false;
    }
    setError(passwordInput, '');
    return true;
  }

  usernameInput.addEventListener('blur', validateUsername);
  passwordInput.addEventListener('blur', validatePassword);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const validUsername = validateUsername();
    const validPassword = validatePassword();

    if (validUsername && validPassword) {
      alert('Login successful!');
      form.reset();
    }
  });
});
