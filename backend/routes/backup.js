const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const Product = require("../models/products");
const Supplier = require("../models/supplier");
const Category = require("../models/category");
const CustomerOrder = require("../models/customerOrder");
const { uploadJsonToS3 } = require("../services/s3Service");
const authAdmin = require("../middleware/authAdmin");

router.get("/download", authAdmin, async (req, res) => {
  try {
    const data = {
      customers: await Customer.find(),
      products: await Product.find(),
      suppliers: await Supplier.find(),
      categories: await Category.find(),
      orders: await CustomerOrder.find()
    };

    // העלאה ל־S3
    const s3Key = await uploadJsonToS3(data);

    // החזרת הורדה מיידית
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="backup.json"`);
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Backup error:", err);
    res.status(500).json({ message: "שגיאה ביצירת הגיבוי" });
  }
});

module.exports = router;
