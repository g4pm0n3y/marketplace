// modules
const express = require('express');

// router setup
const router = express.Router();

// controllers
const products = require('../controllers/products');

// product routes
router.get('/add-product', products.addProduct);
router.post('/add-product', products.createProduct);
router.get('/products', products.getAdminProducts)

// export
module.exports = router;