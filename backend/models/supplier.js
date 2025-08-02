  const mongoose = require('mongoose');

  const supplierSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'שם הספק הוא שדה חובה'],
      unique: true,
      trim: true,
      minlength: [2, 'שם הספק חייב להכיל לפחות 2 תווים']
    },
    contact_name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} אינו כתובת אימייל תקינה`
      }
    },
    notes: {
      type: String,
      trim: true
    },
    is_active: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true });

  module.exports = mongoose.model('Supplier', supplierSchema);


