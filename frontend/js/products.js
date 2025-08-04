window.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("/api/products", {
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
  
        card.className = "product-card";

        card.innerHTML = `
        ${p.image_url ? `<img src="${p.image_url}" alt="תמונה של ${p.name}" class="product-image">` : ''}
        <div class="product-info">
          <strong>${p.name}</strong>
          מחיר: ${p.price_customer} ₪<br>
          קטגוריה: ${p.category?.name || '---'}<br>
          ספק: ${p.supplier?.name || '---'}<br>
          כמות במלאי: ${p.quantity_in_stock}<br><br>
          <label>כמות:
            <input type="number" min="1" value="1" id="qty-${p._id}">
          </label><br>
          ${p.quantity_in_stock <= 0 ? "<p style='color:red'>המוצר אינו זמין במלאי</p>" : ""}
          <br>
          <button class="add-to-cart-btn" onclick="addToCart('${p._id}')" ${p.quantity_in_stock <= 0? "disabled title='המוצר לא זמין במלאי'" : ""}>הוסף לעגלה</button>
        </div>
      `;
        

      
  
        container.appendChild(card);
      });
    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בהתחברות לשרת";
    }
  });
  
  async function addToCart(productId) {
    const qty = parseInt(document.getElementById(`qty-${productId}`).value || "1");
  
    const res = await fetch("/api/cart", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        quantity: qty
      })
    });
  
    const data = await res.json();
    if (res.ok) {
      alert("נוסף לעגלה ✅");
    } else {
      alert(data.message || "שגיאה בהוספה לעגלה");
    }
  }
  