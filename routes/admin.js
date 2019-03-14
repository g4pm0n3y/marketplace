// modules
const express = require('express');

// router setup
const router = express.Router();

// controllers
const products = require('../controllers/products');

// product routes
router.get('/add-product', products.addProduct);
router.post('/add-product', products.createProduct);
router.get('/products', products.getAdminProducts);
router.get('/edit-product/:id', products.editProduct);
router.put('/edit-product/:id', products.updateProduct);
router.delete('/delete-product/:id', products.deleteProduct);

// export
module.exports = router;