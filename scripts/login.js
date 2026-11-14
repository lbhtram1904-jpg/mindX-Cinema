document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  if (!form) return;

  const usernameInput = document.getElementById('Username');
  const passwordInput = document.getElementById('password');
  const rememberMeCheckbox = document.getElementById('remember-me');
  const STORAGE_KEY = 'mindx_users';
  const CURRENT_USER_KEY = 'mindx_current_user';

  function getUsers() {
    const users = localStorage.getItem(STORAGE_KEY);
    try {
      return users ? JSON.parse(users) : [];
    } catch (error) {
      return [];
    }
  }

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

    if (!validUsername || !validPassword) {
      return;
    }

    const users = getUsers();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const matchedUser = users.find((user) => {
      return user.username.toLowerCase() === username.toLowerCase() && user.password === password;
    });

    if (!matchedUser) {
      setError(usernameInput, 'Invalid username or password');
      setError(passwordInput, 'Invalid username or password');
      return;
    }

    const currentUser = {
      username: matchedUser.username,
      avatar: matchedUser.avatar || '../assets/no-image.svg'
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    if (!rememberMeCheckbox || !rememberMeCheckbox.checked) {
      // Save the session anyway so the app knows the user is logged in.
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    alert('Login successful!');
    form.reset();
    window.location.href = 'index.html';
  });
});
