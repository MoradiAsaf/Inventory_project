const customerId = localStorage.getItem("customerId");

async function loadOrders() {
  const res = await fetch(`http://localhost:3000/api/orders/customer/${customerId}`);
  const data = await res.json();

  const container = document.getElementById("content-area");
  container.innerHTML = "<h3>ההזמנות שלי</h3>";

  data.forEach(order => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>תאריך הזמנה: ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p>סטטוס: ${order.status}</p>
      <ul>${order.items.map(i => `<li>${i.product?.name} × ${i.quantity}</li>`).join("")}</ul>
      <p>סה״כ: ₪${order.total_price.toFixed(2)}</p>
      <hr>
    `;
    container.appendChild(div);
  });
}

function loadCustomerDetails() {
  document.getElementById("content-area").innerHTML = "<p>כאן נוכל לעדכן פרטים בהמשך</p>";
}

function loadPaymentDetails() {
  document.getElementById("content-area").innerHTML = "<p>כאן נוסיף אפשרות לעדכון פרטי תשלום</p>";
}
