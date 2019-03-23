// models
const Product = require('../models/product')

// index route
exports.getAdminProducts = (req, res) => {
  Product.find({}, (err, foundProducts) => {
    if(err){
      console.log(err);
    } else {
      res.render('admin/adminproducts', {
        products: foundProducts,
        isAuthenticated: req.session.isLoggedIn
      });
    }
  });
}

// new route
exports.addProduct = (req, res) => {
  res.render('admin/addproduct', {
    isAuthenticated: req.session.isLoggedIn
  });
}

// create route
exports.createProduct = (req, res) => {
  let product = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  }
  Product.create(product, (err, createdProduct) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/admin/products');
    }
  });
}

// edit route
exports.editProduct = (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    if(err){
      console.log(err);
    } else {
      res.render('admin/editproduct', {
        product: foundProduct,
        isAuthenticated: req.session.isLoggedIn
      });
    }
  });
}

// update route
exports.updateProduct = (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, (err, updatedProduct) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/admin/products')
    }
  });
}

// delete route
exports.deleteProduct = (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/admin/products');
    }
  });
}
