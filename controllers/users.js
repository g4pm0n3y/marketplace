const User                = require('../models/user'),
      bcrypt              = require('bcryptjs'),
      nodemailer          = require('nodemailer'),
      sendgridTransport   = require('nodemailer-sendgrid-transport');

// email setup
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

// get signup page
exports.getSignupPage = (req, res) => {
  let errorMsg = req.flash('error') 
  if(errorMsg.length > 0){
    errorMsg = errorMsg[0]
  } else {
    errorMsg = null
  }
  res.render('shop/signup', {isAuthenticated: false, error: errorMsg})
}

// create user
exports.createUser = (req, res) => {
  // search for already used email
  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      // redirect is user exists
      req.flash('error', 'Email already in use')
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
            // send signup confirmation to users email
            return transporter.sendMail({
              to: createdUser.email,
              from: 'marketplace@test.com',
              subject: 'Signup Success',
              text: 'You successfully signed up!'
            });
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
  let errorMsg = req.flash('error') 
  if(errorMsg.length > 0){
    errorMsg = errorMsg[0]
  } else {
    errorMsg = null
  }
  res.render('shop/login', {error: errorMsg});
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
        req.flash('error', 'Invalid email or password')
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
          req.flash('error', 'Invalid email or password')
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