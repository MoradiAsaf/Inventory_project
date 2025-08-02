window.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        credentials: "include"
      });
      const data = await res.json();
  
      if (!res.ok) {
        document.getElementById("message").innerText = data.message || "שגיאה בטעינת ההזמנות";
        return;
      }
  
      const container = document.getElementById("orders-container");
  
      if (data.length === 0) {
        container.innerHTML = "<p>לא נמצאו הזמנות</p>";
        return;
      }
  
      data.forEach(order => {
        const div = document.createElement("div");
        div.className = "order-card";
  
        const itemsList = order.items.map(i =>
          `<li>${i.product?.name || "מוצר לא קיים"} × ${i.quantity}</li>`
        ).join("");
  
        const deliveryDate = new Date(order.delivery_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPast = deliveryDate <= today;
  
        div.innerHTML = `
          <p><strong>לקוח:</strong> ${order.customer?.full_name || "—"} (${order.customer?.username})</p>
          <p><strong>תאריך הזמנה:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>תאריך משלוח:</strong> ${new Date(order.delivery_date).toLocaleDateString()}</p>
          <p><strong>סטטוס נוכחי:</strong> ${translateStatus(order.status)}</p>
          ${order.status === "rejected" && order.rejection_reason
            ? `<p><strong>סיבת דחייה:</strong> ${order.rejection_reason}</p>`
            : ""}
          <ul>${itemsList}</ul>
          <p><strong>סה״כ לתשלום:</strong> ₪${order.total_price.toFixed(2)}</p>
          ${
            order.status === "pending" && !isPast
              ? `<div style="margin-top: 10px;">
                  <button onclick="updateStatus('${order._id}', 'delivered')">סמן כסופקה</button>
                  <button onclick="updateStatus('${order._id}', 'rejected')">דחה הזמנה</button>
                </div>`
              : ""
          }
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
  
  async function updateStatus(orderId, status) {
    const reason = status === "rejected" ? prompt("ציין סיבת דחייה:") : null;
  
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejection_reason: reason })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("הסטטוס עודכן בהצלחה");
        location.reload();
      } else {
        alert(data.message || "שגיאה בעדכון הסטטוס");
      }
    } catch (err) {
      alert("שגיאה בתקשורת עם השרת");
    }
  }
  