// frontend/js/admin/checkAdminAuth.js
window.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("/inventory/api/admin/me", {
        credentials: "include",
      });
  
      if (!res.ok) {
        window.location.href = "login.html";
      }
    } catch (err) {
      window.location.href = "login.html";
    }
  });
  