const customerId = localStorage.getItem("customerId");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`/api/orders/customer/${customerId}`, {
      credentials: "include"
    });
    const data = await res.json();

    if (!res.ok) {
      document.getElementById("message").innerText = data.message || "שגיאה בטעינת ההזמנות";
      return;
    }

    const container = document.getElementById("orders-container");
    if (data.length === 0) {
      container.innerHTML = "<p>לא נמצאו הזמנות.</p>";
      return;
    }

    data.forEach(order => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.marginBottom = "15px";
      div.style.padding = "10px";
      div.style.borderRadius = "6px";
      div.style.backgroundColor = "#fff";

      div.innerHTML = `
        <p><strong>תאריך הזמנה:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>סטטוס:</strong> ${translateStatus(order.status)}</p>
        <ul>
          ${order.items.map(i => `<li>${i.product?.name || "מוצר לא קיים"} × ${i.quantity}</li>`).join("")}
        </ul>
        <p><strong>סה״כ לתשלום:</strong> ₪${order.total_price.toFixed(2)}</p>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
  }
});

function translateStatus(status) {
  switch (status) {
    case "pending": return "ממתינה לאישור";
    case "rejected": return "נדחתה";
    case "delivered": return "סופקה";
    default: return status;
  }
}
