const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  full_name: { type: String, required: true },
  phone:     { type: String },
  address:   { type: String },
  join_date: { type: Date, default: Date.now },

  payment_method: {
    type: String,
    enum: ['credit_card', 'cash', 'transfer'],
    default: 'credit_card'
  },

  billing_day: {
    type: Number, // יום חיוב קבוע בחודש
    min: 1,
    max: 31
  },


  is_active: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model('customer', customerSchema);
