window.addEventListener("DOMContentLoaded", async () => {
    loadSuppliers();
  
    document.getElementById("searchInput").addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = suppliers.filter(s => s.name.toLowerCase().includes(query));
      renderSuppliers(filtered);
    });
  });
  
  let suppliers = [];
  
  async function loadSuppliers() {
    const container = document.getElementById("suppliers-container");
    try {
      const res = await fetch("/api/suppliers", {
        credentials: "include"
      });
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "שגיאה בטעינת ספקים");
      suppliers = data;
      renderSuppliers(suppliers);
    } catch (err) {
      console.error(err);
      container.innerHTML = "⚠️ שגיאה בטעינת ספקים";
    }
  }
  
  function renderSuppliers(list) {
    const container = document.getElementById("suppliers-container");
    container.innerHTML = "";
  
    if (list.length === 0) {
      container.innerHTML = "<p>לא נמצאו ספקים</p>";
      return;
    }
  
    list.forEach(supplier => {
      const div = document.createElement("div");
      div.className = "supplier-card";
      div.innerHTML = `
        <h4>${supplier.name}</h4>
        <div class="supplier-actions">
          <button onclick="editSupplier('${supplier._id}')">✏️ ערוך</button>
          <button onclick="deleteSupplier('${supplier._id}')">🗑️ מחק</button>
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  function showAddForm() {
    document.getElementById("addSupplierForm").style.display = "block";
  }
  
  function hideAddForm() {
    document.getElementById("addSupplierForm").style.display = "none";
    document.getElementById("supplierName").value = "";
    document.getElementById("formMessage").innerText = "";
  }
  
  async function addSupplier() {
    const name = document.getElementById("supplierName").value.trim();
    const message = document.getElementById("formMessage");
  
    if (!name) {
      message.innerText = "יש להזין שם ספק";
      return;
    }
  
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "שגיאה בהוספת ספק");
  
      message.innerText = "✅ ספק נוסף בהצלחה";
      hideAddForm();
      loadSuppliers();
    } catch (err) {
      message.innerText = err.message;
      console.error(err);
    }
  }
  
  function editSupplier(id) {
    alert("בעתיד תתווסף אפשרות לערוך את הספק עם ID: " + id);
  }
  
  function deleteSupplier(id) {
    alert("בעתיד תתווסף אפשרות למחוק את הספק עם ID: " + id);
  }
  