document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const data = {
      username:      document.getElementById("username").value,
      email:         document.getElementById("email").value,
      password:      document.getElementById("password").value,
      full_name:     document.getElementById("full_name").value,
      phone:         document.getElementById("phone").value,
      address:       document.getElementById("address").value,
      payment_method:document.getElementById("payment_method").value,
      billing_day:   parseInt(document.getElementById("billing_day").value)
    };
  
    const res = await fetch("/api/customers/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  
    const result = await res.json();
  
    if (res.ok) {
      window.location.href = "./products.html"; // עובר לרשימת מוצרים אחרי הרשמה
    } else {
      document.getElementById("message").innerText = result.message || "שגיאה בהרשמה";
    }
  });
  