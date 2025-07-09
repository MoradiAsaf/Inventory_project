const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require('dotenv').config({ path: './backend/.env' });

const customerRoute = require("./routes/customers")
const supplierRoute = require("./routes/suppliers")
const categoryRoute = require("./routes/categories")
const productsRoute = require("./routes/products")


mongoose.connect('mongodb://127.0.0.1:27017/inventory_db')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection error', err));

const PORT = process.env.PORT || 3000
const app = express();

app.use(express.json())
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

app.use('/api/customers', customerRoute)
app.use('/api/suppliers', supplierRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/products', productsRoute)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
    
})
