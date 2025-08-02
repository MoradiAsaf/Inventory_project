const CustomerOrder = require("../models/customerOrder");

async function autoUpdateOrders() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await CustomerOrder.updateMany(
      {
        status: "pending",
        delivery_date: { $lte: today }
      },
      { $set: { status: "delivered" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ עודכנו ${result.modifiedCount} הזמנות לסטטוס 'delivered'`);
    }
  } catch (err) {
    console.error("❌ שגיאה בעדכון סטטוס הזמנות:", err.message);
  }
}

function scheduleDailyUpdate() {
  // הפעלה מיידית עם עליית השרת
  autoUpdateOrders();

  // חישוב הזמן עד חצות
  const now = new Date();
  const millisUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

  // קביעת הפעלה ראשונה בחצות, ואז כל 24 שעות
  setTimeout(() => {
    autoUpdateOrders(); // הפעלה ראשונה בחצות

    setInterval(autoUpdateOrders, 24 * 60 * 60 * 1000); // הפעלה יומית
  }, millisUntilMidnight);
}

module.exports = { scheduleDailyUpdate };
