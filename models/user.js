// modules
const mongoose = require('mongoose');

// setup
const Schema = mongoose.Schema; 

// define schema
const userSchema = new Schema({
  name: String,
  email: String,
  cart: [{
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
  }]
})

// create model
const User = mongoose.model('User', userSchema);

module.exports = User;