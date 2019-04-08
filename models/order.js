// modules
const mongoose = require('mongoose');

// setup
const Schema = mongoose.Schema;

// define schema
const orderSchema = {
  products: [{
    productID: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalPrice: Number,
  userID: String,
  date: String
}
// create model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;