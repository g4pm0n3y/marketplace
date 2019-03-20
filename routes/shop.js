// modules
const express = require('express');

// router
const router = express.Router();

// controllers
const shop = require('../controllers/shop');

// routes
router.get('/', shop.getIndex);
router.get('/products', shop.getProducts);
router.get('/products/:id', shop.getProductDetail);
router.get('/cart', shop.getCart);
router.post('/cart', shop.addProductToCart);
router.delete('/cart', shop.deleteCartProduct);
router.get('/checkout', shop.getCheckout);
router.post('/order', shop.createOrder);
router.get('/orders', shop.showOrders);

module.exports = router;