const express = require('express');
const router = express.Router();
const CustomerCart = require('../models/customerCart');
const authMiddleware = require('../middleware/authMiddleware');
const calculateCartTotal = require("../utils/calculateCartTotal");


// שליפת עגלה לפי הלקוח המחובר
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await CustomerCart.findOne({ customer: req.customerId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const total = calculateCartTotal(cart);

    res.status(200).json({ cart, total });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});


// הוספת מוצר לעגלה (או עדכון כמות)
const Product = require('../models/products'); // ודא שהייבוא קיים

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const customerId = req.customerId;

    // שליפת המוצר ובדיקת מלאי
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "המוצר לא נמצא" });
    }

    if (quantity > product.quantity_in_stock) {
      return res.status(400).json({ message: `אין מספיק מלאי למוצר זה. נותרו רק ${product.quantity_in_stock} פריטים.` });
    }

    let cart = await CustomerCart.findOne({ customer: customerId });

    if (!cart) {
      cart = new CustomerCart({
        customer: customerId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.quantity_in_stock) {
          return res.status(400).json({ message: `אין מספיק מלאי למוצר זה. ניתן להוסיף רק עד ${product.quantity_in_stock - cart.items[itemIndex].quantity} פריטים.` });
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    cart.last_updated = Date.now();
    await cart.save();

    res.status(200).json({ message: 'המוצר נוסף לעגלה', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בהוספת מוצר לעגלה" });
  }
});


// עדכון כל העגלה (החלפה מלאה)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { items, delivery_date } = req.body;

    const cart = await CustomerCart.findOneAndUpdate(
      { customer: req.customerId },
      {
        items,
        delivery_date,
        last_updated: Date.now()
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
});

// ניקוי העגלה (לא מוחקים אותה)
router.patch('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await CustomerCart.findOne({ customer: req.customerId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.delivery_date = null;
    cart.last_updated = Date.now();
    await cart.save();

    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
});

module.exports = router;
