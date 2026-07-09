const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: String,
    ref: "User",
  },

  customerName: String,

  customerEmail: String,

  products: Array,

  totalPrice: Number,

  paymentStatus: {
    type: String,
    default: "Pending",
  },

  paymentId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model(
  "Order",
  orderSchema
);