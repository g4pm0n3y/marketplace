// modules
const express = require('express');

// router
const router = express.Router();

// controllers
const error = require('../controllers/error');

// middleware
const checkAuth = require('../middleware/check-auth');

// routes
router.get('/500', error.get500);

module.exports = router;