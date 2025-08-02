const Product = require('../models/products');

async function updateStockOnDelivery(order) {
  for (const item of order.items) {
    const productId = item.product._id || item.product; // תומך גם אם product זה אובייקט וגם אם זה ID
    const product = await Product.findById(productId);
    if (product) {
      product.quantity_in_stock -= item.quantity;
      console.log(`📉 מפחית מהמלאי: ${product.name} - ${product.quantity_in_stock} - פחות ${item.quantity}`);
      if (product.quantity_in_stock < 0) product.quantity_in_stock = 0;
      await product.save();
    }
  }
}

module.exports = updateStockOnDelivery;
