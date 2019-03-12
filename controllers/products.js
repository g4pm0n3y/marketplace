// models
const Product = require('../models/product')

// index route
exports.getAdminProducts = (req, res) => {
  Product.find({}, (err, foundProducts) => {
    if(err){
      console.log(err);
    } else {
      res.render('admin/adminproducts', {products: foundProducts});
    }
  });
}

// new route
exports.addProduct = (req, res) => {
  res.render('admin/addproduct');
}

// create route
exports.createProduct = (req, res) => {
  let product = {
    name: req.body.name
  }
  Product.create(product, (err, createdProduct) => {
    if(err){
      console.log(err)
    } else {
      res.redirect('/')
    }
  });
}
