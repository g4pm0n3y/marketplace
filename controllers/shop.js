const Product = require('../models/product');

// get home page
exports.getIndex = (req, res) => {
  res.render('shop/index');
}

// get all products
exports.getProducts = (req, res) => {
  Product.find({}, (err, foundProducts) => {
    if(err){
      console.log(err);
    } else {
      res.render('shop/allproducts', {products: foundProducts});
    }
  });
}

exports.getCart = (req, res) => {
  res.render('shop/cart');
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout')
}

exports.getOrders = (req, res) => {
  res.render('shop/orders')
}