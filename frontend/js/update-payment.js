const customerId = localStorage.getItem("customerId");

async function loadPaymentData() {
  try {
    const res = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
      credentials: "include"
    });
    const data = await res.json();

    if (res.ok) {
      document.getElementById("payment_method").value = data.payment_method || "credit_card";
      document.getElementById("billing_day").value    = data.billing_day || "";
    } else {
      document.getElementById("message").innerText = data.message || "שגיאה בטעינת פרטים";
    }
  } catch (err) {
    document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
  }
}

document.addEventListener("DOMContentLoaded", loadPaymentData);

document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    payment_method: document.getElementById("payment_method").value,
    billing_day:    parseInt(document.getElementById("billing_day").value)
  };

  const res = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (res.ok) {
    document.getElementById("message").innerText = "✅ פרטי התשלום עודכנו בהצלחה";
  } else {
    document.getElementById("message").innerText = result.message || "❌ שגיאה בעדכון";
  }
});
