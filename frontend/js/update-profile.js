const customerId = localStorage.getItem("customerId");

// טוען את פרטי המשתמש הקיימים
async function loadCustomerData() {
  try {
    const res = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
      credentials: "include"
    });
    const data = await res.json();

    if (res.ok) {
      document.getElementById("full_name").value = data.full_name || "";
      document.getElementById("phone").value     = data.phone || "";
      document.getElementById("address").value   = data.address || "";
    } else {
      document.getElementById("message").innerText = data.message || "שגיאה בטעינת הפרטים";
    }
  } catch (err) {
    document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
  }
}

document.addEventListener("DOMContentLoaded", loadCustomerData);

// שליחת עדכון פרטים
document.getElementById("updateForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    full_name: document.getElementById("full_name").value,
    phone:     document.getElementById("phone").value,
    address:   document.getElementById("address").value
  };

  const res = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (res.ok) {
    document.getElementById("message").innerText = "✅ הפרטים עודכנו בהצלחה";
  } else {
    document.getElementById("message").innerText = result.message || "❌ שגיאה בעדכון";
  }
});
