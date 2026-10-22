let editingProductId = null;
window.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
      loadSuppliers(),
      loadCategories(),
      loadProducts()
    ]);
  
    document.getElementById("addProductForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      await saveProduct();
    });
    
    document.getElementById("cancelEditBtn").addEventListener("click", () => {
        editingProductId = null;
        document.getElementById("addProductForm").reset();
        document.getElementById("cancelEditBtn").style.display = "none";
        document.getElementById("product-form-title").innerText = "➕ הוספת מוצר";

      });
      
  });
  
  async function loadSuppliers() {
    try {
      const res = await fetch("/inventory/api/suppliers");
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
      const res = await fetch("/inventory/api/categories");
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
      const res = await fetch("/inventory/api/products");
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
        <img class="product-image" src="${product.image_url}" alt="Product Image">
        <div class="product-info">
          <strong>${product.name}</strong>
          <p><strong>ספק:</strong> ${product.supplier?.name || '—'}</p>
          <p><strong>מק״ט:</strong> ${product.sku}</p>
          <p><strong>מחיר ללקוח:</strong> ₪${product.price_customer}</p>
          <p><strong>מחיר לחברה:</strong> ₪${product.price_company}</p>
          <p><strong>מלאי:</strong> ${product.quantity_in_stock} ${product.unit}</p>
      
          <div class="product-actions">
            <button onclick="editProduct('${product._id}')">✏️ ערוך</button>
            <button onclick="deleteProduct('${product._id}')">🗑️ מחק</button>
          </div>
        </div>
      `;
      

  
        list.appendChild(div);
      });
  
      list.innerHTML += "</div>";
    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
    }
  }
  
  async function saveProduct() {
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
  
    const method = editingProductId ? "PUT" : "POST";
    const url = editingProductId
      ? `/inventory/api/products/${editingProductId}`
      : "/inventory/api/products";
  
    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert(editingProductId ? "✅ המוצר עודכן" : "✅ מוצר נוסף");
        editingProductId = null;
        document.getElementById("addProductForm").reset();
        document.getElementById("product-form-title").innerText = "➕ הוספת מוצר";

        location.reload();
        document.getElementById("cancelEditBtn").style.display = "none";
      } else {
        document.getElementById("message").innerText = data.message || "שגיאה";
      }
    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
    }
  }
  
  
  async function deleteProduct(productId) {
    if (!confirm("למחוק מוצר זה?")) return;
  
    try {
      const res = await fetch(`/inventory/api/products/${productId}`, {
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
  
  async function editProduct(productId) {
    try {
      document.getElementById("product-form-title").innerText = "✏️ עריכת מוצר";

        document.getElementById("cancelEditBtn").style.display = "inline-block";
      const res = await fetch(`/inventory/api/products/${productId}`);
      const product = await res.json();
  
      if (!res.ok) {
        document.getElementById("message").innerText = "שגיאה בטעינת המוצר";
        return;
      }
  
      // מילוי הטופס עם נתוני המוצר
      document.getElementById("name").value = product.name;
      document.getElementById("sku").value = product.sku;
      document.getElementById("supplier").value = product.supplier?._id;
      document.getElementById("category").value = product.category?._id;
      document.getElementById("price_company").value = product.price_company;
      document.getElementById("price_customer").value = product.price_customer;
      document.getElementById("quantity_in_stock").value = product.quantity_in_stock;
      document.getElementById("unit").value = product.unit;
      document.getElementById("image_url").value = product.image_url;
      document.getElementById("notes").value = product.notes || "";
  
      editingProductId = productId;

    } catch (err) {
      document.getElementById("message").innerText = "שגיאה בתקשורת עם השרת";
    }
  }
  