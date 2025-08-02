window.addEventListener("DOMContentLoaded", async () => {
    loadCategories();
  
    document.getElementById("searchInput").addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = categories.filter(c => c.name.toLowerCase().includes(query));
      renderCategories(filtered);
    });
  });
  
  let categories = [];
  
  async function loadCategories() {
    const container = document.getElementById("categories-container");
    try {
      const res = await fetch("/api/categories", {
        credentials: "include"
      });
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "שגיאה בטעינת קטגוריות");
      categories = data;
      renderCategories(categories);
    } catch (err) {
      console.error(err);
      container.innerHTML = "⚠️ שגיאה בטעינת קטגוריות";
    }
  }
  
  function renderCategories(list) {
    const container = document.getElementById("categories-container");
    container.innerHTML = "";
  
    if (list.length === 0) {
      container.innerHTML = "<p>לא נמצאו קטגוריות</p>";
      return;
    }
  
    list.forEach(category => {
      const div = document.createElement("div");
      div.className = "category-card";
      div.innerHTML = `
        <h4>${category.name}</h4>
        <div class="category-actions">
          <button onclick="editCategory('${category._id}')">✏️ ערוך</button>
          <button onclick="deleteCategory('${category._id}')">🗑️ מחק</button>
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  function showAddForm() {
    document.getElementById("addCategoryForm").style.display = "block";
  }
  
  function hideAddForm() {
    document.getElementById("addCategoryForm").style.display = "none";
    document.getElementById("categoryName").value = "";
    document.getElementById("formMessage").innerText = "";
  }
  
  async function addCategory() {
    const name = document.getElementById("categoryName").value.trim();
    const message = document.getElementById("formMessage");
  
    if (!name) {
      message.innerText = "יש להזין שם קטגוריה";
      return;
    }
  
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "שגיאה בהוספת קטגוריה");
  
      message.innerText = "✅ קטגוריה נוספה בהצלחה";
      hideAddForm();
      loadCategories();
    } catch (err) {
      message.innerText = err.message;
      console.error(err);
    }
  }
  
  function editCategory(id) {
    alert("בעתיד תתווסף אפשרות לערוך את הקטגוריה עם ID: " + id);
  }
  
  function deleteCategory(id) {
    alert("בעתיד תתווסף אפשרות למחוק את הקטגוריה עם ID: " + id);
  }
  