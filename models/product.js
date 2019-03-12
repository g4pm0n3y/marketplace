// modules
const mongoose = require('mongoose');

// setup 
const Schema = mongoose.Schema;

// define schema
const productSchema = new Schema({
  name: String
});

// create model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;