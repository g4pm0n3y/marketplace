// modules
const express         = require('express'),
      mongoose        = require('mongoose'),
      ejs             = require('ejs'),
      session         = require('express-session'),
      bodyParser      = require('body-parser'),
      MongoDBStore    = require('connect-mongodb-session')(session);
      methodOverride  = require('method-override'),
      csrf            = require('csurf');

// database setup
const mongoURI = 'mongodb://localhost:27017/marketplace';
mongoose.connect(mongoURI, {useNewUrlParser: true});

// app setup
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride('_method'));

// session setup
const store = new MongoDBStore({
  uri: mongoURI,
  collection: 'sessions'
});

const csrfSecurity = csrf();
app.use(session({
  secret: 'the leafs will win the cup', 
  resave: false, 
  saveUninitialized: false,
  store: store
}));
app.use(csrfSecurity);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// import routes
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');

// use routes
app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(userRoutes);

// server setup 
app.listen(3000, () => {
  console.log('server started');
})