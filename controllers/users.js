const User = require('../models/user');
const bcrypt = require('bcryptjs')

// get signup page
exports.getSignupPage = (req, res) => {
  res.render('shop/signup', {isAuthenticated: false})
}

// create user
exports.createUser = (req, res) => {
  // search for already used email
  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      // redirect is user exists
      return res.redirect('/signup')
    }
    // encrypt password
    return bcrypt.hash(req.body.password, 12)
      .then(encryptedPassword => {
        // extract new user data and input new user data
        let newUser = {
          name: req.body.name,
          email: req.body.email,
          password: encryptedPassword,
        }
        // create new user
        User.create(newUser, (err, createdUser) => {
          if(err){
            console.log(err);
          } else {
            res.redirect('/login');
          }
        })
      })
  })
  .catch(err => {
    console.log(err)
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
  // get entered email/password
  let email = req.body.email;
  let password = req.body.password;
  // find user with matching email
  User.findOne({email: email})
    .then(user => {
      if(!user){
        return res.redirect('/login')
      }
      // compare password to hash
      bcrypt.compare(password, user.password)
        .then(result => {
          if(result){
            // create user session
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
              res.redirect('/products')
            })
          }
          res.redirect('/login')
        })
        .catch(err => {
          console.log(err);
        })
    })
}

// user logout
exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}