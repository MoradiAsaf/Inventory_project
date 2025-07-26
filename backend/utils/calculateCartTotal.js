function calculateCartTotal(cart) {
    if (!cart?.items) return 0;
  
    return cart.items.reduce((sum, item) => {
      if (!item.product || !item.product.price_customer) return sum;
      return sum + (item.product.price_customer * item.quantity);
    }, 0);
  }
  
  module.exports = calculateCartTotal;
  