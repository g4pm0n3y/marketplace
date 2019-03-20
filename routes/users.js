// modules
const express = require('express');

// router
const router = express.Router();

// controllers
const users = require('../controllers/users');

// routes
router.get('/signup', users.getSignupPage);
router.post('/signup', users.createUser);

module.exports = router;