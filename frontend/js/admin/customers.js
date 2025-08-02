window.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("searchInput");
    const container = document.getElementById("customers-container");
  
    let customers = [];
  
    try {
      const res = await fetch("/api/customers", {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      customers = await res.json();
      renderCustomers(customers);
    } catch (err) {
      container.innerHTML = "שגיאה בטעינת לקוחות";
      console.error(err);
    }
  
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filtered = customers.filter(c =>
        c.full_name.toLowerCase().includes(query) ||
        c.phone?.includes(query)
      );
      renderCustomers(filtered);
    });
  
    function renderCustomers(list) {
      container.innerHTML = "";
      list.forEach(customer => {
        const div = document.createElement("div");
        div.className = "customer-card";
        div.innerHTML = `
          <h4>${customer.full_name} (${customer.phone || "ללא טלפון"})</h4>
          <p>כתובת: ${customer.address || "לא צוינה"}</p>
          <p>סטטוס: ${customer.is_active ? "פעיל" : "מוקפא"}</p>
          <div class="customer-actions">
            <button onclick="editCustomer('${customer._id}')">✏️ ערוך</button>
            <button onclick="toggleCustomer('${customer._id}', ${customer.is_active})">
              ${customer.is_active ? "❄️ הקפא" : "✅ הפוך לפעיל"}
            </button>
          </div>
        `;
        container.appendChild(div);
      });
    }
  });
  
  async function toggleCustomer(customerId, currentStatus) {
    try {
      const res = await fetch(`/api/customers/${customerId}/change_status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ is_active: !currentStatus })
      });
  
      if (!res.ok) throw new Error("שגיאה בעדכון סטטוס");
      location.reload();
    } catch (err) {
      alert("שגיאה בעדכון סטטוס לקוח");
      console.error(err);
    }
  }
  
  function editCustomer(customerId) {
    alert(`בעתיד תתווסף כאן אפשרות לערוך את הלקוח עם ID: ${customerId}`);
  }

function cancelCustomer(customerId) {
  alert(`בעתיד תתווסף כאן אפשרות לבטל לקוח עם ID: ${customerId}`);
}





    