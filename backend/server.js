const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./database");
const path = require("path");
require('dotenv').config({ path: './backend/.env' });



const customerRoute = require("./routes/customers")
const supplierRoute = require("./routes/suppliers")
const categoryRoute = require("./routes/categories")
const productsRoute = require("./routes/products")
const cartRoute = require("./routes/customerCart");
const orderRoute = require("./routes/customerOrder");

connectDB();

const PORT = process.env.PORT || 3000
const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));



app.use('/api/customers', customerRoute)
app.use('/api/suppliers', supplierRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/products', productsRoute)
app.use('/api/cart', cartRoute)
app.use('/api/orders', orderRoute);


// הגשת קבצי סטטיים מהתיקיה frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ניתוב ברירת מחדל – נשלח index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
    
})
