// modules
const mongoose = require('mongoose');

// setup 
const Schema = mongoose.Schema;

// define schema
const productSchema = new Schema({
  name: String,
  imagePath: String,
  description: String,
  price: Number,
  userID: String
});

// create model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;