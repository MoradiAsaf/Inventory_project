const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
require("./database");
const path = require("path");
require('dotenv').config({ path: './backend/.env' });

const { scheduleDailyUpdate } = require("./services/orderStatusUpdater");

const customerRoute = require("./routes/customers")
const supplierRoute = require("./routes/suppliers")
const categoryRoute = require("./routes/categories")
const productsRoute = require("./routes/products")
const cartRoute = require("./routes/customerCart");
const orderRoute = require("./routes/customerOrder");
const adminRoute = require("./routes/admin");
const backupRoute = require("./routes/backup");
const PORT = process.env.PORT || 3000
// האפליקציה מוגשת תחת נתיב בסיס (למשל asafmoradi.com/inventory).
// הפרונט משתמש בנתיבים מוחלטים שמתחילים ב-/inventory, לכן ברירת המחדל כאן זהה.
const BASE_PATH = (process.env.BASE_PATH || "/inventory").replace(/\/+$/, "") || "/";
const app = express();
const site = express.Router();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));



site.use('/api/customers', customerRoute)
site.use('/api/suppliers', supplierRoute)
site.use('/api/categories', categoryRoute)
site.use('/api/products', productsRoute)
site.use('/api/cart', cartRoute)
site.use('/api/orders', orderRoute);
site.use('/api/admin', adminRoute);
site.use('/api/backup', backupRoute);

scheduleDailyUpdate();

// הגשת קבצי סטטיים מהתיקיה frontend
site.use(express.static(path.join(__dirname, "../frontend")));

// ניתוב ברירת מחדל – נשלח index.html
site.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

site.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use(BASE_PATH, site);

if (BASE_PATH !== "/") {
  // שורש הדומיין/הפורט -> האפליקציה
  app.get("/", (req, res) => res.redirect(BASE_PATH + "/"));
}



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT} under ${BASE_PATH}`)
    
})
