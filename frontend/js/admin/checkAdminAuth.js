// frontend/js/admin/checkAdminAuth.js
window.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/me", {
        credentials: "include",
      });
  
      if (!res.ok) {
        window.location.href = "login.html";
      }
    } catch (err) {
      window.location.href = "login.html";
    }
  });
  