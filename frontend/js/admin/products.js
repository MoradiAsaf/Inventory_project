window.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
      loadSuppliers(),
      loadCategories(),
      loadProducts()
    ]);
  
    document.getElementById("addProductForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      await addProduct();
    });
  });
  
  async function loadSuppliers() {
    try {
      const res = await fetch("http://localhost:3000/api/suppliers");
      const suppliers = await res.json();
  
      const select = document.getElementById("supplier");
      suppliers.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s._id;
        opt.textContent = s.name;
        select.appendChild(opt);
      });
    } catch {
      document.getElementById("message").innerText = "שגיאה בטעינת ספקים";
    }
  }
  
  async function loadCategories() {
    try {
      const res = await fetch("http://localhost:3000/api/categories");
      const categories = await res.json();
  
      const select = document.getElementById("category");
      categories.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c._id;
        opt.textContent = c.name;
        select.appendChild(opt);
      });
    } catch {
      document.getElementById("message").innerText = "שגיאה בטעינת קטגוריות";
    }
  }
  
  async function loadProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
  
      if (!res.ok) {
        document.getElementById("message").innerText = data.message || "שגיאה בטעינת מוצרים";
        return;
      }
  
      const list = document.getElementById("product-list");
      list.innerHTML += "<div style='margin-top: 20px;'>";
  
      data.forEach((product) => {
        const div = document.createElement("div");
        div.className = "product-card";
  
        div.innerHTML = `
          <h4>${product.name}</h4>
          <img src="${product.image_url}" alt="Product Image" width="100"><br>
          <strong>מק״ט:</strong> ${product.sku}<br>
          <strong>מחיר לקוח:</strong> ₪${product.price_customer}<br>
          <strong>מחיר לחברה:</strong> ₪${product.price_company}<br>
          <strong>מלאי:</strong> ${product.quantity_in_stock} ${product.unit}<br>
          <button onclick="deleteProduct('${product._id}')">🗑️ מחק</button>
        `;
  
        list.appendChild(div);
      });
  
      list.innerHTML += "</div>";
    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
    }
  }
  
  async function addProduct() {
    const payload = {
      name: document.getElementById("name").value,
      sku: document.getElementById("sku").value,
      supplier: document.getElementById("supplier").value,
      category: document.getElementById("category").value,
      price_company: parseFloat(document.getElementById("price_company").value),
      price_customer: parseFloat(document.getElementById("price_customer").value),
      quantity_in_stock: parseInt(document.getElementById("quantity_in_stock").value),
      unit: document.getElementById("unit").value,
      image_url: document.getElementById("image_url").value,
      notes: document.getElementById("notes").value,
    };
  
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("✅ מוצר נוסף");
        location.reload();
      } else {
        document.getElementById("message").innerText = data.message || "שגיאה בהוספת מוצר";
      }
    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
    }
  }
  
  async function deleteProduct(productId) {
    if (!confirm("למחוק מוצר זה?")) return;
  
    try {
      const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include"
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("🗑️ המוצר נמחק");
        location.reload();
      } else {
        document.getElementById("message").innerText = data.message || "שגיאה במחיקה";
      }
    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
    }
  }
  