// frontend/js/loadNavbar.js
window.addEventListener("DOMContentLoaded", () => {
    fetch("../components/navbar.html")
      .then(res => res.text())
      .then(html => {
        const navbarContainer = document.createElement("div");
        navbarContainer.innerHTML = html;
        document.body.insertBefore(navbarContainer, document.body.firstChild);
      });
  });
  