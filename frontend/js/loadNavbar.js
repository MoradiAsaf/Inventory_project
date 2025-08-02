// בעת טעינת navbar
window.addEventListener("DOMContentLoaded", () => {
  let pathPrefix = location.pathname.includes("/pages/") ? "../" : "";
  fetch(`${pathPrefix}components/navbar.html`)
    .then(res => res.text())
    .then(html => {
      const navbarContainer = document.createElement("div");
      navbarContainer.innerHTML = html;
      document.body.insertBefore(navbarContainer, document.body.firstChild);

      const logoutBtn = navbarContainer.querySelector("#logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          fetch(`${pathPrefix}api/customers/logout`, {
            method: "POST",
            credentials: "include"
          })
            .then(res => res.json())
            .then(data => {
              if (data.message === "logged out successfully") {
                location.href = pathPrefix + "pages/login.html";
              }
            });
            localStorage.removeItem("customerId");
        });
      }
    });
});
