const apiUrl = 'http://localhost:3000/api/customers';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        credentials: 'include', // חשוב לשמירת קוקי
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert('התחברת בהצלחה!');
        window.location.href = 'index.html';
      } else {
        alert(data.error || data.message);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const res = await fetch(`${apiUrl}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert('נרשמת בהצלחה!');
        window.location.href = 'login.html';
      } else {
        alert(data.error || data.message);
      }
    });
  }
});
