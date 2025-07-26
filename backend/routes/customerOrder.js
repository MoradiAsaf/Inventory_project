const express = require('express');
const router = express.Router();
const CustomerOrder = require('../models/customerOrder');
const CustomerCart = require('../models/customerCart');
const Product = require('../models/products');

// יצירת הזמנה מהעגלה
router.post('/checkout/:customerId', async (req, res) => {
  try {
    console.log("checkout");
    
    const { customerId } = req.params;
    console.log("customerId", customerId);
    const cart = await CustomerCart.findOne({ customer: customerId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }
    console.log("cart", cart);

    // בדיקת זמינות מלאי ועדכון מלאי
    let inventoryOK = true;
    for (let item of cart.items) {
      if (item.quantity > item.product.quantity_in_stock) {
        inventoryOK = false;
        break;
      }
    }

    // חישוב סכום כולל
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price_customer;
    }, 0);

    // יצירת הזמנה
    const order = new CustomerOrder({
      customer: customerId,
      delivery_date: req.body.delivery_date,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      total_price: totalPrice,
      inventory_reserved: inventoryOK,
      status: inventoryOK ? 'pending' : 'rejected',
      rejection_reason: inventoryOK ? null : 'Insufficient inventory'
    });

    await order.save();

    // עדכון המלאי
    if (inventoryOK) {
      for (let item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { quantity_in_stock: -item.quantity }
        });
      }
    }

    // ניקוי עגלה – לא מוחקים, רק מאפסים
    cart.items = [];
    cart.delivery_date = null;
    cart.last_updated = Date.now();
    await cart.save();


    res.status(201).json({ message: 'Order created', order });

  } catch (err) {
    console.error("❌ Error during checkout:", err); // הוספת לוג
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});


// שליפת כל ההזמנות של לקוח מסוים
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await CustomerOrder.find({ customer: req.params.customerId }).populate('items.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// שליפת כל ההזמנות (למנהל)
router.get('/', async (req, res) => {
  try {
    const orders = await CustomerOrder.find().populate('customer').populate('items.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// עדכון סטטוס של הזמנה (למנהל)
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;

    const order = await CustomerOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.rejection_reason = status === 'rejected' ? rejection_reason || 'No reason provided' : null;

    await order.save();

    res.status(200).json({ message: 'Order updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

module.exports = router;
