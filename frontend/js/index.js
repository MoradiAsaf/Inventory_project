window.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        credentials: "include"
      });
  
      const products = await res.json();
  
      if (!res.ok) {
        document.getElementById("message").innerText = products.message || "שגיאה בטעינת מוצרים";
        return;
      }
  
      const container = document.getElementById("product-list");
      products.forEach(p => {
        const card = document.createElement("div");
        card.style.border = "1px solid #ccc";
        card.style.margin = "10px";
        card.style.padding = "10px";
        card.style.borderRadius = "6px";
        card.style.backgroundColor = "#fff";
  
        card.innerHTML = `
          <strong>${p.name}</strong><br>
          מחיר: ${p.price_customer} ₪<br>
          קטגוריה: ${p.category?.name || '---'}<br>
          ספק: ${p.supplier?.name || '---'}<br>
          <label>כמות:
            <input type="number" min="1" value="1" id="qty-${p._id}">
          </label>
          <button onclick="handleAddToCart('${p._id}')">הוסף לעגלה</button>
        `;
  
        container.appendChild(card);
      });
    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בהתחברות לשרת";
    }
  });
  
  function handleAddToCart(productId) {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      showLoginPrompt();
      return;
    }
  
    const qty = parseInt(document.getElementById(`qty-${productId}`).value || "1");
  
    fetch("http://localhost:3000/api/cart", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: qty })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "נוסף לעגלה ✅");
      })
      .catch(() => alert("שגיאה בהוספה לעגלה"));
  }
  
  function showLoginPrompt() {
    document.getElementById("loginPrompt").style.display = "block";
  }
  
  function closeLoginPrompt() {
    document.getElementById("loginPrompt").style.display = "none";
  }
  