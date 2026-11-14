document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileForm');
  if (!form) return;

  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarUpload = document.getElementById('avatarUpload');
  const useDefaultAvatarBtn = document.getElementById('useDefaultAvatar');
  const STORAGE_KEY = 'mindx_users';
  const CURRENT_USER_KEY = 'mindx_current_user';

  function getCurrentUser() {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function getUsers() {
    const raw = localStorage.getItem(STORAGE_KEY);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function setError(input, message) {
    const errorBox = input.parentElement.querySelector('.error-message');
    if (!errorBox) return;
    input.classList.toggle('error', !!message);
    errorBox.textContent = message;
  }

  function updateAvatarPreview(url) {
    if (!avatarPreview) return;
    avatarPreview.src = url || '../assets/no-image.svg';
  }

  function fillForm() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    const user = users.find((item) => {
      return item.username && item.username.toLowerCase() === currentUser.username.toLowerCase();
    });

    if (!user) return;

    usernameInput.value = user.username || '';
    emailInput.value = user.email || '';
    passwordInput.value = user.password || '';

    const selectedAvatar = user.avatar || '../assets/no-image.svg';
    const avatarRadio = form.querySelector(`input[name="avatar"][value="${selectedAvatar}"]`);

    if (avatarRadio) {
      avatarRadio.checked = true;
    } else {
      const defaultRadio = form.querySelector('input[name="avatar"][value="../assets/no-image.svg"]');
      if (defaultRadio) defaultRadio.checked = true;
    }

    updateAvatarPreview(selectedAvatar);

    const savedGenres = Array.isArray(user.favoriteGenres) ? user.favoriteGenres : [];
    form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = savedGenres.includes(checkbox.value);
    });
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
      setError(emailInput, 'Email must be valid');
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

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  usernameInput.addEventListener('blur', validateUsername);
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);

  form.querySelectorAll('input[name="avatar"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      updateAvatarPreview(radio.value);
    });
  });

  if (avatarUpload) {
    avatarUpload.addEventListener('change', async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      try {
        const dataUrl = await readFileAsDataUrl(file);
        const customRadio = form.querySelector('input[name="avatar"][value="custom-upload"]');

        if (!customRadio) {
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = 'avatar';
          input.value = 'custom-upload';
          input.checked = true;
          form.insertBefore(input, form.firstChild);
        }

        updateAvatarPreview(dataUrl);
        form.querySelectorAll('input[name="avatar"]').forEach((radio) => {
          radio.checked = radio.value === 'custom-upload';
        });

        const hiddenCustom = document.createElement('input');
        hiddenCustom.type = 'hidden';
        hiddenCustom.name = 'customAvatarData';
        hiddenCustom.value = dataUrl;

        const oldHidden = form.querySelector('input[name="customAvatarData"]');
        if (oldHidden) oldHidden.remove();
        form.appendChild(hiddenCustom);
      } catch (error) {
        alert('Failed to upload avatar');
      }
    });
  }

  if (useDefaultAvatarBtn) {
    useDefaultAvatarBtn.addEventListener('click', () => {
      const defaultValue = '../assets/no-image.svg';
      const defaultRadio = form.querySelector(`input[name="avatar"][value="${defaultValue}"]`);
      if (defaultRadio) defaultRadio.checked = true;
      updateAvatarPreview(defaultValue);
      const oldHidden = form.querySelector('input[name="customAvatarData"]');
      if (oldHidden) oldHidden.remove();
    });
  }

  fillForm();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const validUsername = validateUsername();
    const validEmail = validateEmail();
    const validPassword = validatePassword();
    if (!validUsername || !validEmail || !validPassword) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please log in first');
      return;
    }

    const users = getUsers();
    const userIndex = users.findIndex((user) => {
      return user.username && user.username.toLowerCase() === currentUser.username.toLowerCase();
    });

    if (userIndex === -1) {
      alert('User not found');
      return;
    }

    const selectedAvatar = form.querySelector('input[name="avatar"]:checked')?.value || '../assets/no-image.svg';
    const customDataUrl = form.querySelector('input[name="customAvatarData"]')?.value || '';
    const finalAvatar = customDataUrl || selectedAvatar;
    const selectedGenres = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map((box) => box.value);

    users[userIndex] = {
      ...users[userIndex],
      username: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
      avatar: finalAvatar,
      favoriteGenres: selectedGenres
    };

    saveUsers(users);
    const updatedCurrentUser = {
      username: users[userIndex].username,
      avatar: finalAvatar
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurrentUser));

    alert('Profile updated successfully!');
    window.location.href = 'index.html';
  });
});
