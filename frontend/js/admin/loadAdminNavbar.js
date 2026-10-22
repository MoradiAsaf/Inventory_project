window.addEventListener("DOMContentLoaded", () => {
    const navbar = document.createElement("div");
    navbar.className = "navbar";
  
    navbar.innerHTML = `
      <a href="/inventory/index.html">מסך הבית</a>
      <a href="/inventory/pages/admin/dashboard.html">לוח ניהול</a>
      <a href="/inventory/pages/admin/orders.html">📦 הזמנות</a>
      <a href="/inventory/pages/admin/customers.html">👥 לקוחות</a>
      <a href="/inventory/pages/admin/products.html">🛒 מוצרים</a>
      <a href="/inventory/pages/admin/categories.html">📂 קטגוריות</a>
      <a href="/inventory/pages/admin/suppliers.html">🚚 ספקים</a>
      <a href="/inventory/index.html" id="logout-btn">🔓 התנתקות</a>
    `;
  
    document.body.prepend(navbar);
  
    const logoutBtn = document.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        fetch("/inventory/api/admin/logout", {
          method: "POST",
          credentials: "include"
        })
          .then(res => res.json())
          .then(data => {
            if (data.message === "logged out successfully") {
              location.href = "/inventory/pages/admin/login.html";
            }
          })
          .catch(err => {
            alert("שגיאה בהתנתקות");
            console.error(err);
          });
      });
    }
  });
  