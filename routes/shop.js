// modules
const express = require('express');

// router
const router = express.Router();

// controllers
const shop = require('../controllers/shop');

// routes
router.get('/', shop.getIndex);
router.get('/products', shop.getProducts);
router.get('/cart', shop.getCart);
router.get('/checkout', shop.getCheckout);

module.exports = router;