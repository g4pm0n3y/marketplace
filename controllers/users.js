const User                  = require('../models/user'),
      bcrypt                = require('bcryptjs'),
      crypto                = require('crypto'),
      sgMail                = require('@sendgrid/mail'),
      { validationResult }  = require('express-validator/check');

// email setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// get signup page
exports.getSignupPage = (req, res) => {
  let errorMsg = req.flash('error') 
  if(errorMsg.length > 0){
    errorMsg = errorMsg[0]
  } else {
    errorMsg = null
  }
  res.render('auth/signup', {
    isAuthenticated: false, 
    error: errorMsg, 
    previousInput: {
      name: '',
      email: '',
      password: ''
    }
  });
};

// create user
exports.createUser = (req, res) => {
  // check for thrown validation errors
  let errors = (validationResult(req))
  if(!errors.isEmpty()){
    return res.status(422).render('auth/signup', {
      isAuthenticated: false, 
      error: errors.array()[0].msg,
      previousInput: { 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
    });
  } 
  // encrypt password
  bcrypt.hash(req.body.password, 12)
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
          const msg = {
            to: createdUser.email,
            from: 'marketplace@test.com',
            subject: 'Signup Success',
            text: 'You successfully signed up!'
          };
          sgMail.send(msg)
            .catch(err => {
              console.log(err);
            });
        }
      })
    })
  .catch(err => {
    console.log(err);
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
  res.render('auth/login', {error: errorMsg});
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

// get password reset 
exports.getResetPassword = (req, res) => {
  let errorMsg = req.flash('error') 
  if(errorMsg.length > 0){
    errorMsg = errorMsg[0]
  } else {
    errorMsg = null
  }
  res.render('auth/reset.ejs', {error: errorMsg})
}

// initiate password reset
exports.resetPassword = (req, res) => {
  // create token
  crypto.randomBytes(32, (err, buffer) => {
    if(err){
      console.log(err)
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    // find user and set token on user
    User.findOne({email: req.body.email})
      .then(user => {
        if(!user){
          req.flash('error', 'No User Found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        user.save();
        res.redirect('/');
        // send reset email to user
        const msg = {
          to: req.body.email,
          from: 'marketplace@test.com',
          subject: 'Password Reset',
          html: `
          <p>You have requested a password reset.</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}"> to set a new password.</p>
          `
        };
        sgMail.send(msg)
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err)
      })
  })
}

// get new password form
exports.getNewPassword = (req, res) => {
  // get token from params
  const token = req.params.token;
  // find user with valid token that matches
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      let errorMsg = req.flash('error') 
      if(errorMsg.length > 0){
        errorMsg = errorMsg[0]
      } else {
        errorMsg = null
      }
      // render update password form
      res.render('auth/password', {
        error: errorMsg,
        userID: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err)
    })
}

// set new password for user
exports.setNewPassword = (req, res) => {
  // get data from form
  const password = req.body.password;
  const userID = req.body.userID;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  // find user with matching token and ID
  User.findOne({
    resetToken: passwordToken, 
    resetTokenExpiration: {$gt: Date.now()}, 
    _id: userID
  })
  .then(user => {
    resetUser = user;
    // encrypt password
    return bcrypt.hash(password, 12);
  })
  .then(newPassword => {
    // set new password and reset tokens for user
    resetUser.password = newPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
  });
};