document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/customers/login", {
    method: "POST",
    credentials: "include", // חשוב מאוד כדי לקבל את ה-cookie
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("customerId", data.customer._id);
    window.location.href = "../pages/products.html"; // מעבר לאחר התחברות
  } else {
    document.getElementById("message").innerText = data.error || data.message;
  }
});
