const User = require('../models/user');

// get signup page
exports.getSignupPage = (req, res) => {
  res.render('shop/signup', {isAuthenticated: false})
}

// create user
exports.createUser = (req, res) => {
  let user = {
    name: req.body.name,
    email: req.body.email
  }
  User.create(user, (err, createdUser) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  })
}

// get login page
exports.getLoginPage = (req, res) => {
  res.render('shop/login', {
    isAuthenticated: false
  });
}

// user login
exports.userLogin = (req, res) => {
  let userID = '5c8d62a99806bd30e1b22667';
  User.findById(userID)
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        res.redirect('/products')
      })
    })
    .catch(err => console.log(err));
}

// user logout
exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}