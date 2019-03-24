// modules
const express = require('express');

// router setup
const router = express.Router();

// controllers
const products = require('../controllers/products');

// middleware
const checkAuth = require('../middleware/check-auth');

// product routes
router.get('/add-product', checkAuth, products.addProduct);
router.post('/add-product', checkAuth, products.createProduct);
router.get('/products', checkAuth, products.getAdminProducts);
router.get('/edit-product/:id', checkAuth, products.editProduct);
router.put('/edit-product/:id', checkAuth, products.updateProduct);
router.delete('/delete-product/:id', checkAuth, products.deleteProduct);

// export
module.exports = router;