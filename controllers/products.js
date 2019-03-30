// models
const Product = require('../models/product');

// index route
exports.getAdminProducts = (req, res) => {
  Product.find({userID: req.session.user._id}, (err, foundProducts) => {
    if(err){
      console.log(err);
    } else {
      res.render('admin/adminproducts', {
        products: foundProducts,
      }); 
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
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    userID: req.session.user._id
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
      res.render('admin/editproduct', {product: foundProduct});
    }
  });
}

// update route
exports.updateProduct = (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      if(product.userID == req.session.user._id) {
        Product.findByIdAndUpdate(req.params.id, req.body, (err, updatedProduct) => {
          if(err){
            console.log(err);
          } else {
            res.redirect('/admin/products')
          }
        });
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.log(err);
    });
}

// delete route
exports.deleteProduct = (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      if(product.userID == req.session.user._id){
        Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
          if(err){
            console.log(err);
          } else {
            res.redirect('/admin/products');
          }
        });
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.log(err);
    });
}
