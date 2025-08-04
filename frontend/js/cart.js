window.addEventListener("DOMContentLoaded", () => {
  loadCart();

  // הגדרת תאריך מינימלי למשלוח
  const deliveryInput = document.getElementById("deliveryDate");
  if (deliveryInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    deliveryInput.min = `${yyyy}-${mm}-${dd}`;
  }
});

async function loadCart() {
  try {
    const res = await fetch("/api/cart", {
      credentials: "include"
    });
    const data = await res.json();

    if (!res.ok) {
      document.getElementById("cart-container").innerText = data.message || "שגיאה בטעינת העגלה";
      return;
    }

    const container = document.getElementById("cart-container");
    container.innerHTML = "";

    if (data.cart.items.length === 0) {
      container.innerHTML = "<p>העגלה שלך ריקה.</p>";
      return;
    }

    data.cart.items.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item-card";
      
      div.innerHTML = `
        <div class="cart-item-content">
          <img src="${item.product?.image_url || '../images/placeholder.png'}" alt="מוצר" class="cart-product-image">
          <div class="cart-product-info">
            <strong>${item.product?.name || "מוצר"}</strong><br>
            כמות: ${item.quantity}<br>
            מחיר יחידה: ₪${item.product?.price_customer || 0}<br>
            סה״כ: ₪${(item.quantity * item.product?.price_customer).toFixed(2)}
          </div>
        </div>
      `;
      
      container.appendChild(div);
    });

    document.getElementById("total").innerText = `סה״כ לתשלום: ₪${data.total.toFixed(2)}`;
  } catch (err) {
    document.getElementById("cart-container").innerText = "שגיאה בתקשורת עם השרת";
  }
}

document.getElementById("placeOrderBtn").addEventListener("click", async () => {
  try {
    const customerId = localStorage.getItem("customerId");
    const deliveryDate = document.getElementById("deliveryDate").value;

    const res = await fetch(`/api/orders/checkout/${customerId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delivery_date: deliveryDate })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      window.location.reload(); // מרענן את הדף ומרוקן את העגלה
    } else {
      alert(data.message || "שגיאה בביצוע ההזמנה");
    }
  } catch (err) {
    alert("שגיאה בתקשורת עם השרת");
  }
});
