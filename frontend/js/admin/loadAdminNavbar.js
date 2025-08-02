window.addEventListener("DOMContentLoaded", () => {
    const navbar = document.createElement("div");
    navbar.className = "navbar";
  
    navbar.innerHTML = `
      <a href="/index.html">מסך הבית</a>
      <a href="/pages/admin/dashboard.html">לוח ניהול</a>
      <a href="/pages/admin/orders.html">📦 הזמנות</a>
      <a href="/pages/admin/customers.html">👥 לקוחות</a>
      <a href="/pages/admin/products.html">🛒 מוצרים</a>
      <a href="/pages/admin/categories.html">📂 קטגוריות</a>
      <a href="/pages/admin/suppliers.html">🚚 ספקים</a>
      <a href="#" id="logout-btn">🔓 התנתקות</a>
    `;
  
    document.body.prepend(navbar);
  
    const logoutBtn = document.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        fetch("/api/admin/logout", {
          method: "POST",
          credentials: "include"
        })
          .then(res => res.json())
          .then(data => {
            if (data.message === "logged out successfully") {
              location.href = "/pages/admin/login.html";
            }
          })
          .catch(err => {
            alert("שגיאה בהתנתקות");
            console.error(err);
          });
      });
    }
  });
  