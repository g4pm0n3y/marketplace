// modules
const express = require('express');

// router
const router = express.Router();

// controllers
const shop = require('../controllers/shop');

// middleware
const checkAuth = require('../middleware/check-auth');

// routes
router.get('/', shop.getIndex);
router.get('/products', shop.getProducts);
router.get('/products/:id', shop.getProductDetail);
router.get('/cart', checkAuth, shop.getCart);
router.post('/cart', checkAuth, shop.addProductToCart);
router.delete('/cart', checkAuth, shop.deleteCartProduct);
router.get('/checkout', checkAuth, shop.getCheckout);
router.post('/order', checkAuth, shop.createOrder);
router.get('/orders', checkAuth, shop.showOrders);
router.get('/orders/:orderID', checkAuth, shop.downloadInvoice);

module.exports = router;