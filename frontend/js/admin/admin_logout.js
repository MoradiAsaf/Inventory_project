function admin_logout() {
fetch("/api/admin/logout", {
    method: "POST",
    credentials: "include"
})
.then(res => res.json())
.then(data => {
    if (data.message === "logged out successfully") {
        window.location.href = "/pages/admin/login.html";
    }
})
}
const logoutBtn = document.querySelector("#logout-btn");
logoutBtn.addEventListener("click", admin_logout);