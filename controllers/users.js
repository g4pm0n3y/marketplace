const User = require('../models/user');

// get signup page
exports.getSignupPage = (req, res) => {
  res.render('shop/signup')
}

// create user
exports.createUser = (req, res) => {
  let user = {
    name: req.body.name,
    email: req.body.email
  }
  User.create(user, (err, createdUser) => {
    if(err){
      console.log(err)
    } else {
      res.redirect('/')
    }
  })
}