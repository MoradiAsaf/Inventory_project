const mongoose = require('mongoose');

const customerOrderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: "customer",
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    delivery_date: {
        type: Date,
        required: true
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

    total_price: {
        type: Number, // כולל מע״מ, מחושב בצד השרת
        required: true
    },

    inventory_reserved: {
        type: Boolean,
        default: false // האם היה מלאי זמין בזמן ההזמנה
    },

    status: {
        type: String,
        enum: ['pending', 'fulfilled', 'rejected'],
        default: 'pending'
    },

    rejection_reason: {
        type: String,
        default: null
    },

    note_to_admin: {
        type: String,
        default: ''
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("customerOrders", customerOrderSchema);
