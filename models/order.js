// modules
const mongoose = require('mongoose');

// setup
const Schema = mongoose.Schema;

// define schema
const orderSchema = {
  products: [{
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
  }],
  totalPrice: Number,
  userID: String
}
// create model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;