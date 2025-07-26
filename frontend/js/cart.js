window.addEventListener("DOMContentLoaded", loadCart);

async function loadCart() {
  try {
    const res = await fetch("http://localhost:3000/api/cart", {
      credentials: "include"
    });
    const data = await res.json();

    if (!res.ok) {
      document.getElementById("cart-container").innerText = data.message || "שגיאה בטעינת עגלה";
      return;
    }

    const container = document.getElementById("cart-container");
    container.innerHTML = "";

    data.cart.items.forEach(item => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.margin = "10px";
      div.style.padding = "10px";

      div.innerHTML = `
        <strong>${item.product?.name || "מוצר"}</strong><br>
        כמות: ${item.quantity}<br>
        מחיר יחידה: ₪${item.product?.price_customer || 0}<br>
        סה״כ: ₪${(item.quantity * item.product?.price_customer).toFixed(2)}
      `;

      container.appendChild(div);
    });

    document.getElementById("total").innerText = `סה״כ לתשלום: ₪${data.total.toFixed(2)}`;
  } catch (err) {
    document.getElementById("cart-container").innerText = "שגיאה בהתחברות לשרת";
  }
}


document.getElementById("placeOrderBtn").addEventListener("click", async () => {
    try {
        const customerId = localStorage.getItem("customerId");
const deliveryDate = document.getElementById("deliveryDate").value;
      const res = await fetch(`http://localhost:3000/api/orders/checkout/${customerId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_date: deliveryDate }) 
      });
      
  
      const data = await res.json();
  
      if (res.ok) {
        alert(data.message);
        window.location.reload(); // רענון לעגלה ריקה
      } else {
        alert(data.message || "שגיאה בביצוע ההזמנה");
      }
    } catch (err) {
      alert("שגיאה בתקשורת עם השרת");
    }
  });
  