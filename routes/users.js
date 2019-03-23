// modules
const express = require('express');

// router
const router = express.Router();

// controllers
const users = require('../controllers/users');

// routes
router.get('/signup', users.getSignupPage);
router.post('/signup', users.createUser);
router.get('/login', users.getLoginPage);
router.post('/login', users.userLogin);
router.get('/logout', users.getLogout);

module.exports = router;