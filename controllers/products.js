// models
const Product = require('../models/product');
const mongoose = require('mongoose');
const fileHelper = require('../helper/file')

// variables
const itemsPerPage = 6;

// index route
exports.getAdminProducts = (req, res, next) => {
  // pagination logic
  let page = +req.query.page || 1;
  let totalProducts;

  Product.find({userID: req.session.user._id})
    .countDocuments()
    .then(productCount => {
      // product logic
      totalProducts = productCount
      return Product.find()
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
      })
      .then(foundProducts => {
        res.render('admin/adminproducts', {
          products: foundProducts,
          currentPage: page,
          hasNextPage: itemsPerPage * page < totalProducts,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalProducts / itemsPerPage)
      })
    })
    .catch(err => {
    let error = new Error(err);
    error.httpStatusCode = 500;
    console.log(err)
    return next(error); 
  })
  // Product.find({userID: req.session.user._id}, (err, foundProducts) => {
  //   if(err){
  //     console.log(err);
  //   } else {
  //     res.render('admin/adminproducts', {
  //       products: foundProducts,
  //     }); 
  //   }
  // });
}

// new route
exports.addProduct = (req, res, next) => {
  let errorMsg = req.flash('error') 
  if(errorMsg.length > 0){
    errorMsg = errorMsg[0]
  } else {
    errorMsg = null
  }
  res.render('admin/addproduct', {
    error: errorMsg,
    previousInput: {
      name: '',
      price: '',
      description: ''
    }
  });
}

// create route
exports.createProduct = (req, res, next) => {
  if(!req.file){
    return res.render('admin/addproduct', {
      previousInput: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
      },
      error: 'Please add a valid image'
    })
    // res.redirect('add-product')
  } else {
    let product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      imagePath: req.file.path,
      userID: req.session.user._id
    }
    Product.create(product)
      .then(result => {
        res.redirect('/admin/products')
      })
      .catch(err => {
        let error = new Error(err);
        error.httpStatusCode = 500;
        return next(error); 
      })
  }
}

// edit route
exports.editProduct = (req, res, next) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    if(err){
      console.log(err);
    } else {
      res.render('admin/editproduct', {product: foundProduct});
    }
  });
}

// update route
exports.updateProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if(product.userID == req.session.user._id) {
        return product 
      }
    })
    .then(product => {
      product.name = req.body.name
      product.price = req.body.price
      product.description = req.body.description
      if(req.file){
        if(product.imagePath.length > 0){
          fileHelper.deleteFile(product.imagePath);
        }
        product.imagePath = req.file.path
      }
      product.save()
      res.redirect('/admin/products')
    })
    .catch(err => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    })
}

// delete route
exports.deleteProduct = (req, res, next) => {
  Product.findById(req.params.id)
  .then(product => {
    if(product.imagePath.length > 0){
      fileHelper.deleteFile(product.imagePath);
    }
    if(product.userID == req.session.user._id){
      Product.findByIdAndDelete(req.params.id)
        .then(() => {
          res.status(200).json({message: 'Success!'});
        })
    //     if(err){
    //       console.log(err);
    //     } else {
    //       res.redirect('/admin/products');
    //     }
    //   });
    // } else {
    //   res.redirect('/')
    }
  })
  .catch(err => {
    res.status(500).json({message: 'Delete Failed'});
  })
}
