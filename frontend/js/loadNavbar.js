window.addEventListener("DOMContentLoaded", () => {
  const navbar = document.createElement("div");
  navbar.className = "navbar";

  navbar.innerHTML = `
    <a href="/inventory/index.html">מסך הבית</a>
    <a href="/inventory/pages/personal.html">🏠 אזור אישי</a>
    <a href="/inventory/pages/products.html">🛍 מוצרים</a>
    <a href="/inventory/pages/cart.html">🛒 עגלה</a>
    <a href="/inventory/index.html" id="logout-btn">🔓 התנתקות</a>
  `;

  document.body.prepend(navbar);

  const logoutBtn = document.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.href = "/inventory/pages/login.html";
    });
  }
});
