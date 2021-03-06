// modules
const fs = require('fs');
const path = require('path');
const pdf = require('pdfkit');
const stripe = require("stripe")("sk_test_44ND1yHuoBEafkAKmRopZ4Ug00Kn5Vp4G3");

// models
const Product   = require('../models/product');
const User      = require('../models/user');
const Order     = require('../models/order');

// variables
const itemsPerPage = 6;

// get home page
exports.getIndex = (req, res) => {
  res.render('shop/index');
}

// get all products
exports.getProducts = (req, res) => {
  // pagination logic
  let page = +req.query.page || 1;
  let totalProducts;

  Product.find()
    .countDocuments()
    .then(productCount => {
      // product logic
      totalProducts = productCount
      return Product.find()
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
      })
      .then(products => {
        res.render('shop/allproducts', {
          products: products,
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
    return next(error); 
  })
}

// get product detail
exports.getProductDetail = (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    if(err){
      console.log(err)
    } else {
      res.render('shop/showproduct', {
        product: foundProduct,
      });
    }
  });
}

// get cart
exports.getCart = (req, res) => {
  // get user & populate products in cart & render
  User.findById(req.session.user)
    .populate({
        path: 'cart.productID',
        model: 'Product'
    })
    .then(user => {
      let totalPrice = 0;
      let productArray = []
      user.cart.forEach(product => {
        let productPrice = product.productID.price * product.quantity;
        totalPrice += productPrice;
        productArray.push(product)
      });
      res.render('shop/cart', {
        userCart: user, 
        totalPrice: totalPrice,
        userID: user._id,
        products: productArray,
      });
    })
    .catch(err => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    })
}

// add product to cart
exports.addProductToCart = (req, res) => {
  if(req.session.user == null){
    res.redirect('/login')
  } else {
    let productID = req.body.id;
    // find user
    User.findById(req.session.user)
      .then(user => {
        // add product or increase product quantity
        let index = user.cart.findIndex(product => product.productID == productID);
        if(index === -1){
          user.cart.push({productID: productID, quantity: 1});
          user.save();
          res.redirect('/cart');
        } else {
          user.cart[index]['quantity'] += 1;
          user.save();
          res.redirect('/cart');
        }
      })
      .catch(err => {
        let error = new Error(err);
        error.httpStatusCode = 500;
        return next(error); 
      })
  }
}

// delete product from cart
exports.deleteCartProduct = (req, res) => {
  let deletedID = req.body.id;
  User.findById(req.session.user)
    .then(user => {
      let deletedIndex = user.cart.findIndex(product => product.productID == deletedID);
      if(user.cart[deletedIndex]['quantity'] > 1){
        user.cart[deletedIndex]['quantity'] -= 1;
        user.save();
        res.redirect('/cart');
      } else if (user.cart[deletedIndex]['quantity'] == 1){
        user.cart[deletedIndex].remove();
        user.save();
        res.redirect('/cart');
      } 
    })
    .catch(err => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    })
}

// get checkout
exports.getCheckout = (req, res) => {
  User.findById(req.session.user)
    .populate({
        path: 'cart.productID',
        model: 'Product'
    })
    .then(user => {
      let totalPrice = 0;
      let productArray = []
      user.cart.forEach(product => {
        let productPrice = product.productID.price * product.quantity;
        totalPrice += productPrice;
        productArray.push(product)
      });
      res.render('shop/checkout', {
        userCart: user, 
        totalPrice: totalPrice,
        userID: user._id,
        products: productArray,
      });
    })
    .catch(err => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    })
}

// create orders
exports.createOrder = (req, res, next) => {
// stripe token
const token = req.body.stripeToken; 
// create order 
  let order = {
    userID: req.session.user._id,
    products: [],
    totalPrice: 0
  }
  Order.create(order)
    .then(order => {
      // find user and populate cart items
      User.findById(req.session.user)
        .populate({
          path: 'cart.productID',
          model: 'Product'
        })
        // add each cart product to order
        .then(user => {
          user.cart.forEach(product => {
            let cartProduct = {
              productID: product.productID._id,
              name: product.productID.name,
              price: product.productID.price,
              quantity: product.quantity
            }
            order.totalPrice += cartProduct.price * cartProduct.quantity;
            order.products.push(cartProduct);
          })
          // get date for the order
          let currentDate = new Date().toISOString().replace(/\T.+/, '')
          order.date = currentDate
          // save all changes
          user.cart = [];
          user.save()
          return order.save()
        })
        .then(result => {
          const charge = stripe.charges.create({
            amount: result.totalPrice * 100,
            currency: 'cad',
            description: 'Demo Order',
            source: token,
            metadata: {order_id: result._id.toString()}
          });
        })
        .then(() => {
          res.redirect('/orders')
        })
    })
    .catch(err => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    })
}

// show orders
exports.showOrders = (req, res) => {
  Order.find({userID: req.session.user._id})
    .then(orders => {
      res.render('shop/orders', {
        orders: orders,
      })
    })
    .catch(err => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    })
}

// download invoices
exports.downloadInvoice = (req, res, next) => {
  Order.findById(req.params.orderID)
  .then(order => {
      let orderID = req.params.orderID;
      if(!order){
        return next(new Error('No order'));
      }
      if(order.userID !== req.session.user._id.toString()){
        return next(new Error('No order'));
      }

      // create invoice pdf file
      let invoice = 'invoice-' + orderID + '.pdf';
      let invoicePath = path.join('data', 'invoices', invoice);
      let pdfDocument = new pdf();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoice + '"');
      pdfDocument.pipe(fs.createWriteStream(invoicePath));
      pdfDocument.pipe(res);
      pdfDocument.fontSize(26).text('Invoice', {
        underline: true
      });
      order.products.forEach(product => {
        pdfDocument.fontSize(14).text(product.name + ' - ' + product.quantity + ' x $' + product.price)
      })
      pdfDocument.text('----------------------------')
      pdfDocument.fontSize(18).text('Total Price: $' + order.totalPrice)
      pdfDocument.end();
    })
    .catch(err => {
      console.log(err)
      next(err);
    });
}