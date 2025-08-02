const express = require('express');
const router = express.Router();
const CustomerOrder = require('../models/customerOrder');
const CustomerCart = require('../models/customerCart');
const Product = require('../models/products');
const authAdmin = require("../middleware/authAdmin");
const calculateCartTotal = require('../utils/calculateCartTotal');





// יצירת הזמנה מהעגלה
router.post('/checkout/:customerId', async (req, res) => {
  try {
    const { delivery_date } = req.body;
    const customerId = req.params.customerId;

    if (!delivery_date) {
      return res.status(400).json({ message: "חובה לציין תאריך משלוח" });
    }

    const selectedDate = new Date(delivery_date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      return res.status(400).json({ message: 'לא ניתן לבחור תאריך משלוח שהוא היום או מהעבר' });
    }

    const cart = await CustomerCart.findOne({ customer: customerId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "העגלה ריקה" });
    }

    const totalPrice = calculateCartTotal(cart); // ✅ שימוש בפונקציה שלך

    const order = new CustomerOrder({
      customer: customerId,
      delivery_date,
      items: cart.items
        .filter(item => item.product)
        .map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
      total_price: totalPrice,
      status: "pending"
    });

    await order.save();
    await CustomerCart.findOneAndUpdate({ customer: customerId }, { items: [] });

    res.status(201).json({ message: "ההזמנה בוצעה בהצלחה", order });

  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "שגיאה בביצוע ההזמנה", error: err.message });
  }
});




// שליפת כל ההזמנות של לקוח מסוים
router.get('/customer/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    if (customerId == "null") {
      res.status(400).json({ message: "לקוח לא מוגדר" });
      return;
    }
    const orders = await CustomerOrder.find({ customer: req.params.customerId }).populate('items.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// שליפת כל ההזמנות (למנהל)
router.get('/', authAdmin, async (req, res) => {
  try {
    const orders = await CustomerOrder.find().populate('customer').populate('items.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// עדכון סטטוס של הזמנה (למנהל)
router.patch('/:orderId/status', authAdmin, async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;

    console.log("📥 עדכון סטטוס:", status, " | סיבת דחייה:", rejection_reason);

    const order = await CustomerOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.rejection_reason = status === 'rejected' ? rejection_reason || 'No reason provided' : null;

    await order.save();

    res.status(200).json({ message: 'Order updated', order });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


module.exports = router;
