const mongoose = require('mongoose');

const customerCartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true,
        unique: true // לכל לקוח עגלה אחת בלבד
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],

    delivery_date: {
        type: Date
    },

    last_updated: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("customerCart", customerCartSchema);
