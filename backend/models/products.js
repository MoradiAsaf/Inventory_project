  const mongoose = require('mongoose');
const VAT_RATE = parseFloat(process.env.VAT_RATE);


const productSchema = new mongoose.Schema({
  name: {type:String, required:true, unique:true},
  sku:{type:String, required:true, unique:true},

  supplier: {type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required:true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  is_active: { type: Boolean, default: true },
  price_company:  { type: Number, required: true, min: 0 }, 
  price_customer: { type: Number, required: true, min: 0 },
  quantity_in_stock: { type: Number, default: 0 },
  unit: { type: String, default: "unit" },
  notes: { type: String },
  ב: { type: String, required: false },

  
}, {timestamps:true});

/* מחירי ברוטו (עם מע״מ) */
productSchema.virtual('price_company_gross').get(function () {
  return Number((this.price_company * (1 + VAT_RATE)).toFixed(2));
});

productSchema.virtual('price_customer_gross').get(function () {
  return Number((this.price_customer * (1 + VAT_RATE)).toFixed(2));
});




/* רווח נטו */
productSchema.virtual('profit_amount').get(function () {
  return this.price_customer - this.price_company;           
});
productSchema.virtual('profit_percent').get(function () {
  return this.price_company === 0 ? 0
    : ((this.price_customer - this.price_company) / this.price_company) * 100;
});



/* ---------- Hooks / Validation ---------- */

productSchema.pre('validate', function (next) {
  if (this.price_customer < this.price_company) {
    return next(new Error('price_customer must be ≥ price_company'));
  }
  next();
});

/* כולל את הווירטואלים בכל JSON/Object שיוצא מה-API */
productSchema.set('toJSON',   { virtuals: true });
productSchema.set('toObject', { virtuals: true });




module.exports = mongoose.model("Product", productSchema);
