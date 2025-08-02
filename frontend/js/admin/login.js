document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include", // חשוב כדי לקבל את ה-cookie
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // מעבר לממשק ניהול ראשי
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("message").innerText = data.message || "שגיאה בהתחברות";
      }
    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
    }
  });
  