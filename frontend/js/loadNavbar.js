window.addEventListener("DOMContentLoaded", () => {
  const navbar = document.createElement("div");
  navbar.className = "navbar";

  navbar.innerHTML = `
    <a href="/index.html">מסך הבית</a>
    <a href="/pages/personal.html">🏠 אזור אישי</a>
    <a href="/pages/products.html">🛒 מוצרים</a>
    <a href="/pages/cart.html">🛍 עגלה</a>
    <a href="#" id="logout-btn">🔓 התנתקות</a>
  `;

  document.body.prepend(navbar);

  const logoutBtn = document.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.href = "/pages/login.html";
    });
  }
});
