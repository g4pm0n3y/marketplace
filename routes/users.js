// modules
const express = require('express');
const { check, body } = require('express-validator/check');

// router
const router = express.Router();

// controllers
const users = require('../controllers/users');

// models
const User = require('../models/user');

// routes
router.get('/signup', users.getSignupPage);

router.post('/signup', [
  body('email', "Invalid Email")
    .isEmail()
    .custom((value, {req}) => {
      // search for already used email
      return User.findOne({email: value})
        .then(user => {
          if(user){
            return Promise.reject('Email exists already');
          }
        })
    })
    .normalizeEmail(),
  body('password', 'Passwords must be at least 6 characters long')
    .isLength({min: 6})
    .trim(),
  body('confirmpassword').custom((value, {req}) => {
    if(value !== req.body.password){
      throw new Error('Passwords have to match!')
    }
    return true
  })
], users.createUser);

router.get('/login', users.getLoginPage);

router.post('/login', users.userLogin);

router.get('/logout', users.getLogout);

router.get('/reset', users.getResetPassword);

router.post('/reset', users.resetPassword);

router.get('/reset/:token', users.getNewPassword);

router.post('/password', users.setNewPassword);

module.exports = router;