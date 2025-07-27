window.addEventListener("DOMContentLoaded", () => {
    let pathPrefix = location.pathname.includes("/pages/") ? "../" : "";
    fetch(`${pathPrefix}components/navbar.html`)
      .then(res => res.text())
      .then(html => {
        const navbarContainer = document.createElement("div");
        navbarContainer.innerHTML = html;
        document.body.insertBefore(navbarContainer, document.body.firstChild);
      });
  });
  